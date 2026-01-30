import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import MarkDownRenderer from "../common/MarkDownRenderer"
import toast from 'react-hot-toast';

const ChatInterface = () => {
    const { id: documentId } = useParams();
    const { user } = useAuth();

    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    // (Optional) fetch chat history here if you already have API
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setInitialLoading(true);
                const response=await aiService.getChatHistory(documentId);
                setHistory(response.data);
                // const res = await aiService.getChatHistory(documentId);
                // setHistory(res.data || []);
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch chat history.')
            } finally {
                setInitialLoading(false);
            }
        };
        fetchChatHistory();
    }, [documentId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = {
            role: 'user',
            content: message,
            timestamp:new Date()
        };

        setHistory((prev) => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const res = await aiService.chat(documentId, userMessage.content);
            const aiMessage = {
                role: 'assistant',
                content: res?.data?.answer || res?.answer || '',
                timestamp:new Date(),
                relevantChunks:res.data.relevantChunks
            };
            setHistory((prev) => [...prev, aiMessage]);
        } catch (e) {
            console.error(e);
            console.log(e);
            
            const errorMessage={
                role:'assistant',
                content:'Sorry, I encountered an error. Please try again.',
                timestamp:new Date()
            }
            setHistory(prev=>[...prev,errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';

    return (
        <div
            key={index}
            className={`flex items-start gap-3 my-4 ${
                isUser ? 'justify-end' : 'justify-start'
            }`}
        >
            {/* AI Avatar */}
            {!isUser && (
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-emerald-100 shrink-0">
                    <Sparkles
                        className="text-emerald-600"
                        size={18}
                        strokeWidth={2}
                    />
                </div>
            )}

            {/* Message Bubble */}
            <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    isUser
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-md'
                        : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md'
                }`}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap">
                        {msg.content}
                    </p>
                ) : (
                    <div className="prose prose-sm max-w-none">
                        <MarkDownRenderer content={msg.content} />
                    </div>
                )}
            </div>

            {/* User Avatar */}
            {isUser && (
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-900 text-white text-xs font-semibold shrink-0">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
            )}
        </div>
    );
};


    if (initialLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 mb-3">
                <MessageSquare
                    className="text-emerald-600"
                    strokeWidth={2}
                />
            </div>

            <p className="text-sm font-medium text-gray-700">
                Loading chat history…
            </p>
            <p className="text-xs text-gray-500 mt-1">
                This may take a moment
            </p>
        </div>
    );
}


   
    return (
        <div className="flex flex-col h-[70vh] bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-50">
                <MessageSquare className="text-emerald-600" size={18} />
                <h3 className="text-sm font-semibold text-gray-800">
                    AI Chat Assistant
                </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50">
                {history.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <Sparkles className="mb-2 text-emerald-500" />
                        <p className="text-sm">
                            Ask questions about this document to get instant help.
                        </p>
                    </div>
                )}

                {history.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${
                            msg.role === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[75%] rounded-xl px-4 py-3 text-sm shadow
                                ${
                                    msg.role === 'user'
                                        ? 'bg-emerald-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 rounded-bl-none border'
                                }
                            `}
                        >
                            {msg.role === 'assistant' ? (
                                <MarkDownRenderer content={msg.content} />
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border rounded-xl px-4 py-2 text-sm text-gray-500 shadow">
                            Thinking…
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask something about this document…"
                        disabled={loading}
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                        type="submit"
                        onClick={handleSendMessage}
                        disabled={loading}
                        className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
