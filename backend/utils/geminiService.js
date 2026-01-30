import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai=new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

if(!process.env.GOOGLE_API_KEY){
    console.error("Warning: GOOGLE_API_KEY is not set in environment variables. Gemini API calls will fail.");
    process.exit(1);
}

/**
 * @param {string} text - Document text
 * @param {number} count- Number of flashcards to generate
 * @returns {Promise<Array<{question:string,answer:string, difficulty:string}>>} - Generated flashcards
 */

export const generateFlashcardsFromDocument= async (text, count=10) => {
    const prompt=`Generate ${count} educational flashcards from the following text.
     Format each  flashcard as :
     Q:[Clear,specific question]
     A:[Concise,accurate answer]
     D:[easy,medium,hard]

     Separate each flashcard with "---"

     Text:
     ${text.substring(0,15000)}`;

     try{
       const response=await ai.models.generateContent({
        model:"gemini-2.5-flash-lite",
        contents:prompt,
       })

       const generatedText=response.text;

       const flashcards=[];
       const cards=generatedText.split("---").filter(c=>c.trim());

       for (const card of cards){
       const lines=card.trim().split("\n");
       let question='', answer='', difficulty='medium';

       for( const line of lines){
        if(line.startsWith("Q:")){
            question=line.substring(2).trim();   
        }else if(line.startsWith("A:")){
            answer=line.substring(2).trim();
        }else if(line.startsWith("D:")){
            const diff=line.substring(2).trim().toLowerCase();
            if(['easy','medium','hard'].includes(diff)){
                difficulty=diff;
            }
        }
       }
         if(question && answer){
            flashcards.push({question, answer, difficulty});
        }
         }
         return flashcards.slice(0,count);
     }catch(error){
        console.error("Gemini API error:", error);
        throw new Error('Failed to generate flashcards using Gemini API');
     }
};


/** @param {string} text - Document text
 * @param {number} count - Number of quiz questions to generate
 * @returns {Promise<Array<{question:string, options:Array, correctAnswer:string, explanation:string, difficulty:string}>>} - Generated quiz questions
*/
 
export const generateQuiz= async (text, numQuestions) => {
    const prompt=`Generate a quiz with ${numQuestions} multiple-choice questions from the following text.
    Format each question as:
    Q:[Question]
    O1:[Option 1]
    O2:[Option 2]
    O3:[Option 3]
    O4:[Option 4]
    C:[Correct Option Text- must match one of the options]- Provide exact text
    E:[Explanation for the correct answer]
    D:[D- easy, medium, hard]

    Separate each question with "---"

    Text:
    ${text.substring(0,15000)}`;

    try{
        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash-lite",
            contents:prompt,
        });

        const generatedText=response.text;
        // console.log(generatedText);
        

        const quizQuestions=[];
        const questions=generatedText.split("---").filter(q=>q.trim());
        // console.log(questions);
        
        for (const ques of questions){
            const lines=ques.trim().split("\n");
            // console.log(lines);
            
            let question='', options=[], correctAnswer='', explanation='', difficulty='medium';
            for (const line of lines){
                const trimmedLine=line.trim();
                // console.log(trimmedLine);
                
                if(trimmedLine.startsWith("Q:")){
                    question=trimmedLine.substring(2).trim();
                   
                    
                }else if(trimmedLine.startsWith("O1:") || trimmedLine.startsWith("O2:") || trimmedLine.startsWith("O3:") || trimmedLine.startsWith("O4:")){
                    options.push(trimmedLine.substring(3).trim());
                }else if(trimmedLine.startsWith("C:")){
                    correctAnswer=trimmedLine.substring(2).trim();
                }else if(trimmedLine.startsWith("E:")){
                    explanation=trimmedLine.substring(2).trim();
                }else if(trimmedLine.startsWith("D:")){
                    const diff=trimmedLine.substring(2).trim().toLowerCase();   
                    if(['easy','medium','hard'].includes(diff)){
                        difficulty=diff;
                    }   
                }
            }

            if(question && options.length===4 && correctAnswer && options.includes(correctAnswer)){
                quizQuestions.push({question, options, correctAnswer, explanation, difficulty});
            }
            // console.log("h",options);
            // console.log("q",correctAnswer);
            // console.log("ww",explanation);
            // console.log("rt",difficulty);
            
            
            
            
        //  console.log("rjr",quizQuestions);
         
        }
//         console.log("numQuestions:", numQuestions, typeof numQuestions);
// console.log("quizQuestions length:", quizQuestions.length);

        
        return quizQuestions.slice(0,numQuestions);
    }catch(error){
        console.error("Gemini API error:", error);
        throw new Error('Failed to generate quiz using Gemini API');
    }
}
 

/**
 * @param {string} text - Document text
 * @returns {Promise<string>} - Generated summary
 */

export const summarizeDocument= async (text) => {
    const prompt=`Summarize the following text in a concise manner, highlighting the key points and main ideas.
    Text:
    ${text.substring(0,15000)}`;
    try{
        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash-lite",
            contents:prompt,
        });
        const summary=response.text;
        return summary.trim();
    }catch(error){
        console.error("Gemini API error:", error);
        throw new Error('Failed to generate summary using Gemini API');
    }
};

/**
 * @param {string} question - Document text
 * @param{Array<Object>} chunks - Generated keywords
 * @returns {Promise<string>} - Generated answer
 */


export const chatWithContext = async (question, chunks) => {
  if (!question || !chunks?.length) {
    return "Insufficient information to answer the question.";
  }

  const MAX_CHUNKS = 3;
  const MAX_CHUNK_LENGTH = 1500;

  const contextText = chunks
    .slice(0, MAX_CHUNKS)
    .map(
      (c, i) =>
        `### Reference ${i + 1}\n${c.content.slice(0, MAX_CHUNK_LENGTH)}`
    )
    .join("\n\n");

  const prompt = `
You are an AI assistant.

Answer the question using ONLY the information in the references below.
You may infer answers if the information is implied.
If there is truly not enough information, say so clearly.

References:
${contextText}

Question:
${question}

Answer:
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    // ✅ CORRECT extraction for your SDK
    // console.log(response);
    
    const generatedText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text;


    if (!generatedText) {
      console.error("Empty Gemini response:", response);
      return "Insufficient information to answer the question.";
    }

    return generatedText.trim();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate answer using Gemini API");
  }
};

    

/** 
 * @param {string} concept- Document text
 * @param {string} cntext - Concept to explain
 * @returns {Promise<string>} - Relevant content
 */

export const explainConcept= async (concept, context) => {
    const prompt=`Using the following context, explain the concept "${concept}" in a clear and concise manner.
    Context:
    ${context.substring(0,15000)}
    Explanation:`;

    try{
        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash-lite",
            contents:prompt,
        });
        const generatedText=response.text;
        return generatedText;
    }catch(error){
        console.error("Gemini API error:", error);
        throw new Error('Failed to generate explanation using Gemini API');
    }
};