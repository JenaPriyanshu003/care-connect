import { useState, useEffect, useCallback } from 'react';

export const useSpeech = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setSupported(false);
        }
    }, []);

    const startListening = useCallback(() => {
        if (!supported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // Could handle language switching here

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
        };

        recognition.start();
    }, [supported]);

    const speak = useCallback((text) => {
        if (!('speechSynthesis' in window)) return;

        // Cancel existing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Select a voice that mimics the professional "Nova" or "Ava" style
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice =>
            voice.name.includes("Google US English") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Microsoft Zira") ||
            voice.name.includes("Female")
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        // Speed: 1.1 is professional and efficient but not rushed (smooth)
        utterance.rate = 1.1;
        // Pitch: 0.95 gives a slightly deeper, warmer, and more authoritative "doctor" tone
        utterance.pitch = 0.95;

        window.speechSynthesis.speak(utterance);
    }, []);

    return {
        isListening,
        transcript,
        setTranscript,
        startListening,
        isSpeaking,
        speak,
        supported
    };
};
