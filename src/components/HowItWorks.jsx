import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Camera, Navigation, FileText, Heart, ShieldCheck, Zap } from 'lucide-react';

const HowItWorks = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">How Care-Connect Works</h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Your Journey to Better Health</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Experience a seamless healthcare journey powered by advanced AI. Here is exactly how to use every feature.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Step 1: Chat */}
                    <Section
                        number="01"
                        title="AI Consultation"
                        icon={<MessageSquare className="w-6 h-6 text-white" />}
                        color="bg-blue-500"
                    >
                        <p className="mb-4">Start by describing your symptoms in the chat. You can type or use voice commands naturally.</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li><strong>Voice Mode:</strong> Tap the microphone and speak in any language.</li>
                            <li><strong>Smart Analysis:</strong> Our AI asks clarifying questions to understand your condition deeply.</li>
                            <li><strong>Instant Advice:</strong> Get immediate first-aid suggestions and medical guidance.</li>
                        </ul>
                    </Section>

                    {/* Step 2: Vision */}
                    <Section
                        number="02"
                        title="Vision Diagnosis"
                        icon={<Camera className="w-6 h-6 text-white" />}
                        color="bg-purple-500"
                    >
                        <p className="mb-4">Have a visual symptom? Use the "Vision" feature to upload photos.</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li><strong>Skin Issues:</strong> Upload photos of rashes, bites, or wounds for instant analysis.</li>
                            <li><strong>Medication:</strong> Snap a picture of a pill or bottle to identify it and check usage.</li>
                            <li><strong>Lab Results:</strong> Upload medical reports to get a simplified explanation.</li>
                        </ul>
                    </Section>

                    {/* Step 3: Location */}
                    <Section
                        number="03"
                        title="Emergency Finder"
                        icon={<Navigation className="w-6 h-6 text-white" />}
                        color="bg-red-500"
                    >
                        <p className="mb-4">Need physical help? The "Emergency" tab uses your precise location.</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li><strong>Nearby Help:</strong> Instantly find the closest hospitals and pharmacies.</li>
                            <li><strong>One-Click Navigation:</strong> Get direct Google Maps directions to the facility.</li>
                        </ul>
                    </Section>

                    {/* Step 4: Report */}
                    <Section
                        number="04"
                        title="Export SBAR Report"
                        icon={<FileText className="w-6 h-6 text-white" />}
                        color="bg-green-600"
                    >
                        <p className="mb-4">Going to a real doctor? Take your AI consultation with you.</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li><strong>Format:</strong> Generates a professional SBAR (Situation, Background, Assessment, Recommendation) report.</li>
                            <li><strong>PDF Download:</strong> Save the chat history and analysis as a PDF to share with healthcare providers.</li>
                        </ul>
                    </Section>
                </div>

                <div className="mt-20 text-center">
                    <button
                        onClick={() => navigate('/chat')}
                        className="bg-primary hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-green-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
                    >
                        <Zap className="w-5 h-5" />
                        Start Your Free Consultation Now
                    </button>
                    <p className="mt-4 text-sm text-gray-500">No login required.</p>
                </div>
            </main>
        </div>
    );
};

const Section = ({ number, title, icon, color, children }) => (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute top-0 left-0 w-2 h-full ${color}`} />
        <div className="flex-shrink-0">
            <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div className="mt-2 text-center font-bold text-gray-400 text-xl">{number}</div>
        </div>
        <div className="flex-grow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {title}
            </h3>
            <div className="text-gray-600 text-lg leading-relaxed">
                {children}
            </div>
        </div>
    </div>
);

export default HowItWorks;
