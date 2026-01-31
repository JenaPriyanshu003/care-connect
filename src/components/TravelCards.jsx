import React, { useState } from 'react';
import { ArrowLeft, Globe, Volume2, Type, Loader2, AlertTriangle, Heart, Stethoscope, Pill, Ambulance, X, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';



const CATEGORIES = [
    { id: 'medical', label: 'Medical', icon: <Stethoscope className="w-4 h-4" />, phrases: ["I have diabetes", "I need a doctor", "Where is the hospital?", "I feel dizzy"] },
    { id: 'allergies', label: 'Allergies', icon: <AlertTriangle className="w-4 h-4" />, phrases: ["I am allergic to peanuts", "I am allergic to penicillin", "Does this contain gluten?", "I have a seafood allergy"] },
    { id: 'pharmacy', label: 'Pharmacy', icon: <Pill className="w-4 h-4" />, phrases: ["I need painkillers", "Do you have this medicine?", "I need insulin", "Where is the nearest pharmacy?"] },
    { id: 'emergency', label: 'Emergency', icon: <Ambulance className="w-4 h-4" />, phrases: ["Call an ambulance!", "Help me!", "It is an emergency", "I've been in an accident"] },
];

const LANGUAGES = ['Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese (Mandarin)', 'Arabic', 'Thai', 'Vietnamese', 'Portuguese', 'Hindi', 'Russian', 'Korean'];

const TravelCards = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [targetLang, setTargetLang] = useState('Spanish');
    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('medical');
    const [showFullScreen, setShowFullScreen] = useState(false);

    const generateCard = async (textToTranslate = inputText) => {
        if (!textToTranslate.trim()) return;

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBX0zOG_JGmS7nsmbLqBk4LqYbNaqsWiDo";
        if (!apiKey) {
            setError('API Key configuration error.');
            return;
        }

        setLoading(true);
        setError('');
        // If clicking a chip, update input to match
        setInputText(textToTranslate);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Translate this medical/travel phrase into ${targetLang}. 
            Return a JSON object with this structure (no markdown):
            {
                "translated": "The translated text in local script",
                "phonetic": "How to pronounce it in English characters (transliteration)"
            }
            Phrase: "${textToTranslate}"`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Cleanup json formatting if AI adds it
            const jsonText = text.replace(/```json|```/g, '').trim();
            const data = JSON.parse(jsonText);

            setCardData({
                original: textToTranslate,
                translated: data.translated,
                phonetic: data.phonetic,
                language: targetLang
            });
        } catch (err) {
            console.error(err);
            setError('Translation failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="text-gray-600 w-6 h-6" />
                </button>
                <h1 className="font-bold text-xl text-gray-900 tracking-tight">Travel Cards</h1>
                <div className="w-8" />
            </header>

            <main className="flex-grow p-4 md:p-6 max-w-2xl mx-auto w-full flex flex-col gap-6">

                {/* Category Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2 noscroll-bar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                                ${activeCategory === cat.id
                                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 scale-105'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.find(c => c.id === activeCategory)?.phrases.map((phrase, idx) => (
                        <button
                            key={idx}
                            onClick={() => generateCard(phrase)}
                            className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-sm text-gray-600 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-colors text-left"
                        >
                            {phrase}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
                    <textarea
                        className="w-full p-4 bg-transparent outline-none resize-none text-lg text-gray-800 placeholder:text-gray-300 min-h-[100px]"
                        placeholder="Or type anything here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <div className="px-4 pb-4 flex flex-col sm:flex-row items-center gap-3">
                        <select
                            className="w-full sm:w-auto p-2.5 bg-gray-50 rounded-xl font-medium text-gray-700 outline-none border border-gray-200 focus:border-green-500"
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                        >
                            {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                        </select>

                        <button
                            onClick={() => generateCard()}
                            disabled={loading || !inputText}
                            className="w-full sm:flex-1 h-11 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Translate'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                        <AlertTriangle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {/* Card Result area - Placeholder or Result */}
                <div className="flex-grow flex flex-col justify-start">
                    <AnimatePresence mode="wait">
                        {cardData ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 relative group"
                            >
                                {/* Top colored bar */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 opacity-80 text-sm font-medium mb-1">
                                            <Globe className="w-4 h-4" />
                                            {cardData.language} Translation
                                        </div>
                                        <h2 className="text-2xl font-bold">Medical Card</h2>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => speak(cardData.translated)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors">
                                            <Volume2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setShowFullScreen(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors">
                                            <Maximize2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 text-center flex flex-col gap-6">

                                    <div className="space-y-2">
                                        <p className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                                            {cardData.translated}
                                        </p>
                                        {cardData.phonetic && (
                                            <p className="text-lg text-indigo-600 font-medium font-serif italic">
                                                / {cardData.phonetic} /
                                            </p>
                                        )}
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full" />

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Original</p>
                                        <p className="text-xl text-gray-600 font-medium">
                                            "{cardData.original}"
                                        </p>
                                    </div>

                                    <div className="mt-4 bg-blue-50 text-blue-800 text-xs font-bold py-2 px-4 rounded-full self-center">
                                        Show this screen to medical personnel
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            !loading && (
                                <div className="text-center py-20 opacity-40">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <Globe className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Select a phrase or type below to create a travel card.</p>
                                </div>
                            )
                        )}
                    </AnimatePresence>
                </div>

            </main>

            {/* Fullscreen Overlay */}
            <AnimatePresence>
                {showFullScreen && cardData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white z-50 flex flex-col p-6 items-center justify-center text-center"
                    >
                        <button
                            onClick={() => setShowFullScreen(false)}
                            className="absolute top-6 right-6 p-4 bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                            <X className="w-8 h-8 text-gray-600" />
                        </button>

                        <div className="space-y-8 max-w-4xl">
                            <h3 className="text-gray-500 font-medium text-xl uppercase tracking-widest">
                                I am trying to say:
                            </h3>
                            <p className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                                {cardData.translated}
                            </p>
                            {cardData.phonetic && (
                                <p className="text-3xl text-indigo-600 font-serif italic">
                                    / {cardData.phonetic} /
                                </p>
                            )}
                            <div className="pt-12">
                                <p className="text-2xl text-gray-500">"{cardData.original}"</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TravelCards;
