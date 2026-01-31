
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

    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const updateVoices = () => {
            const output = window.speechSynthesis.getVoices();
            console.log("Detailed Voices Check:", output.length > 0 ? output.length + " voices found" : "No voices yet");
            if (output.length > 0) {
                setVoices(output);
            }
        };

        // Browsers load voices asynchronously
        window.speechSynthesis.onvoiceschanged = updateVoices;

        // Initial check
        updateVoices();

        // Polling fallback
        const interval = setInterval(() => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setVoices(voices);
                clearInterval(interval);
            }
        }, 500);

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
            clearInterval(interval);
        };
    }, []);

    const speak = useCallback((text, selectedVoiceName = null, pitch = 1.3, rate = 1.0) => {
        if (!('speechSynthesis' in window)) return;

        // Cancel existing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const availableVoices = window.speechSynthesis.getVoices();

        let preferredVoice;

        if (selectedVoiceName) {
            preferredVoice = availableVoices.find(v => v.name === selectedVoiceName);
        }

        if (!preferredVoice) {
            // Priority 1: Google US English (Female sounding)
            // Priority 2: Microsoft Zira (Female)
            // Priority 3: Samantha (Mac Female)
            // Priority 4: Any voice with "Female" in the name
            preferredVoice =
                availableVoices.find(v => v.name === "Google US English") ||
                availableVoices.find(v => v.name === "Microsoft Zira Desktop") ||
                availableVoices.find(v => v.name === "Samantha") ||
                availableVoices.find(v => v.name.includes("Female"));
        }

        if (preferredVoice) {
            utterance.voice = preferredVoice;
            console.log("Using Voice:", preferredVoice.name);
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        // Apply pitch and rate
        utterance.pitch = pitch;
        utterance.rate = rate;

        window.speechSynthesis.speak(utterance);
    }, []);

    return {
        isListening,
        transcript,
        setTranscript,
        startListening,
        isSpeaking,
        speak,
        supported,
        voices
    };
};
