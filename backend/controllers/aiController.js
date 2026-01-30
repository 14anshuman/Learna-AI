import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from "../utils/geminiService.js"
import findRelevantChunks  from "../utils/textChunker.js";


export const generateFlashcards = async (req, res, next) => {
    try {

        const { documentId, count = 10 } = req.body;
        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Document ID is required',
                statusCode: 400,
            });
        }
        const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404,
            });
        }
        const cards = await geminiService.generateFlashcardsFromDocument(document.extractedText, parseInt(count));
        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
  question: card.question,
  answer: card.answer,
  difficulty: card.difficulty,
  reviewCount: 0,
  isStarred: false
})),
        })
        return res.status(200).json({
            success: true,
            data: flashcardSet,
            message: 'Flashcards generated successfully',

        });

    } catch (error) {
        next(error);
    }
}



export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestions , title } = req.body;
        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Document ID is required',
                statusCode: 400,
            });
        }
        const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404,
            });
        }
        // console.log(document.extractedText)
        const quizQuestions = await geminiService.generateQuiz(document.extractedText,numQuestions);
        // console.log(quizQuestions);
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || 'Quiz on ' + document.title,
            questions: quizQuestions,
            totalQuestions: quizQuestions.length,
            userAnswers: [],
            score: 0,
        });
        res.status(200).json({
            success: true,
            data: quiz,
            message: 'Quiz generated successfully',
        });
    } catch (error) {
        next(error);
    }
}



export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body;
        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Document ID is required',
                statusCode: 400,
            });
        }
        const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404,
            });
        }
        const summary = await geminiService.summarizeDocument(document.extractedText);
        res.status(200).json({
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                summary
            },
            message: 'Document summarized successfully',
        });

    } catch (error) {
        next(error);
    }
}



export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body;
        if (!documentId || !question) {
            return res.status(400).json({
                success: false,
                error: 'Document ID and question are required',
                statusCode: 400,
            });
        }
        
        
        const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });
        
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404,
            });
        }
        // console.log(question);
        const chunks = document.extractedText
  .split("\n\n")
  .map((text, i) => ({
    id: i,
    content: text,
  }));

 
        const relevantChunks = findRelevantChunks(chunks, question, 1);
        const chunkIndcies = relevantChunks.map(chunk => chunk.index);

        // console.log("heheh",relevantChunks);
        
        let chatHistory = await ChatHistory.findOne({ documentId: document._id, userId: req.user._id });
        if (!chatHistory) {
            chatHistory = await ChatHistory.create({ documentId: document._id, userId: req.user._id, messages: [] });
        }
        // console.log(document.extractedText)
        const answer = await geminiService.chatWithContext(question, relevantChunks);
         
        // console.log(answer);
        

        chatHistory.messages.push({ role: 'user', content: question, timestamp: new Date(), relevantChunks: [] });
        chatHistory.messages.push({ role: 'assistant', content: answer, timestamp: new Date(), referencedChunks: chunkIndcies });

        await chatHistory.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                chatHistoryId: chatHistory._id,
                relevantChunks: chunkIndcies,
            },
            message: 'Chat response generated successfully',
        });


    } catch (error) {
        next(error);
        console.log(error);
        
    }
}



export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body;
        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                error: 'Document ID and concept are required',
                statusCode: 400,
            });
        }
        const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404,
            });

        }
        const relevantChunks = await findRelevantChunks(document.chunks, concept, 1);
        const context = relevantChunks.map(chunk => chunk.text).join('\n\n');
        const explanation = await geminiService.explainConcept(concept, context);
        res.status(200).json({
            success: true,
            data: {
                concept,
                explanation,
                relevantChunks: relevantChunks.map(chunk => chunk.index),
            },
            message: 'Concept explained successfully',
        });




    } catch (error) {
        next(error);
    }
}



export const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId',
                statusCode: 400
            });
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: documentId
        }).select('messages'); // Only retrieve the messages array

        if (!chatHistory) {
            return res.status(200).json({
                success: true,
                data: [], // Return an empty array if no chat history found
                message: 'No chat history found for this document'
            });
        }

        res.status(200).json({
            success: true,
            data: chatHistory.messages,
            message: 'Chat history retrieved successfully'
        });



    } catch (error) {
        next(error);
    }
}