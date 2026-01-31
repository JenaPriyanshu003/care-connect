import React, { useState } from 'react';
import { ArrowLeft, Search, Heart, Activity, AlertTriangle, Thermometer, Wind, Droplet, Zap, Bone, Eye, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FirstAidGuide = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState(null);

    // Comprehensive Database of First Aid Topics (Aiming for variety)
    const topics = [
        // CRITICAL / LIFE SAVING
        {
            id: 'cpr',
            title: 'CPR (Adult)',
            category: 'Critical',
            icon: Heart,
            color: 'text-red-500',
            symptoms: ['Unconscious', 'No breathing', 'No pulse'],
            action: [
                'Call Emergency Services immediately.',
                'Place hands on center of chest.',
                'Push hard and fast (100-120 compressions/min).',
                'Allow chest to recoil completely after each push.',
                'Continue until help arrives or person wakes up.'
            ],
            avoid: ['Do not stop unless exhausted or unsafe.', 'Do not check pulse for >10s.']
        },
        {
            id: 'heart_attack',
            title: 'Heart Attack',
            category: 'Critical',
            icon: Activity,
            color: 'text-red-500',
            symptoms: ['Chest pain/pressure', 'Pain in arm/jaw', 'Shortness of breath', 'Cold sweat'],
            action: [
                'Call Emergency Services immediately.',
                'Have person sit down and rest.',
                'Loosen tight clothing.',
                'Chew and swallow an aspirin (if not allergic).',
                'Begin CPR if unconscious/not breathing.'
            ],
            avoid: ['Do not drive yourself to hospital.', 'Do not ignore chest pain.']
        },
        {
            id: 'choking',
            title: 'Choking',
            category: 'Critical',
            icon: Wind,
            color: 'text-orange-500',
            symptoms: ['Clutching throat', 'Unable to speak/breathe', 'Blue lips'],
            action: [
                'Stand behind person.',
                'Wrap arms around waist.',
                'Fist above navel, other hand over fist.',
                'Perform quick upward thrusts (Heimlich Maneuver).',
                'Repeat until object is dislodged.'
            ],
            avoid: ['Do not slap back if person is upright (can lodge deeper).']
        },
        {
            id: 'stroke',
            title: 'Stroke (F.A.S.T.)',
            category: 'Critical',
            icon: Activity,
            color: 'text-red-500',
            symptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Sudden confusion'],
            action: [
                'F (Face): Ask to smile.',
                'A (Arms): Ask to raise both arms.',
                'S (Speech): Ask to repeat a phrase.',
                'T (Time): Call Emergency immediately if ANY sign is present.',
                'Note the time symptoms started.'
            ],
            avoid: ['Do not give food or drink.', 'Do not let them sleep.']
        },

        // INJURIES / TRAUMA
        {
            id: 'bleeding_severe',
            title: 'Severe Bleeding',
            category: 'Trauma',
            icon: Droplet,
            color: 'text-red-600',
            symptoms: ['Heavy blood flow', 'Spurting blood', 'Soaked clothes'],
            action: [
                'Call Emergency Services.',
                'Apply direct pressure with clean cloth.',
                'Keep pressure constant (do not peek).',
                'If blood soaks through, add more layers (don’t remove).',
                'Raise limb above heart level if possible.'
            ],
            avoid: ['Do not remove the object if stabbed (stabilize it).']
        },
        {
            id: 'burns',
            title: 'Burns (Minor/Major)',
            category: 'Trauma',
            icon: Thermometer,
            color: 'text-orange-500',
            symptoms: ['Red skin', 'Blisters', 'Charred skin (Major)'],
            action: [
                'Cool with cool (not cold) running water for 10-20 mins.',
                'Cover loosely with sterile, non-stick bandage.',
                'For major burns, call emergency and elevate part.'
            ],
            avoid: ['Do not pop blisters.', 'Do not apply ice directly.', 'Do not use butter/ointments on fresh burns.']
        },
        {
            id: 'fracture',
            title: 'Broken Bone',
            category: 'Trauma',
            icon: Bone,
            color: 'text-slate-400',
            symptoms: ['Pain', 'Swelling', 'Deformity', 'Inability to move'],
            action: [
                'Immobilize the area (do not move it).',
                'Apply ice pack wrapped in cloth to reduce swelling.',
                'Stop any bleeding with gentle pressure.',
                'Seek medical attention.'
            ],
            avoid: ['Do not try to straighten the bone.', 'Do not massage.']
        },
        {
            id: 'head_injury',
            title: 'Head Injury / Concussion',
            category: 'Trauma',
            icon: AlertTriangle,
            color: 'text-yellow-500',
            symptoms: ['Headache', 'Nausea', 'Dizziness', 'Confusion'],
            action: [
                'Rest immediately.',
                'Apply ice for swelling.',
                'Watch for worsening symptoms (vomiting, seizure).',
                'Seek medical attention if confused or passed out.'
            ],
            avoid: ['Do not return to sports/activity immediately.', 'Do not shake the person.']
        },

        // ENVIRONMENTAL
        {
            id: 'heat_stroke',
            title: 'Heat Stroke',
            category: 'Environmental',
            icon: Thermometer,
            color: 'text-red-500',
            symptoms: ['Hot dry skin', 'High body temp (>103°F)', 'Rapid pulse', 'Confusion'],
            action: [
                'Move to cooler place immediately.',
                'Cool rapidly (wet cloths, bath, fan).',
                'Do not give fluids if unconscious.',
                'Call Emergency Services.'
            ],
            avoid: ['Do not assume it will pass.', 'Do not give aspirin (increases bleeding risk).']
        },
        {
            id: 'snake_bite',
            title: 'Snake Bite',
            category: 'Environmental',
            icon: AlertTriangle,
            color: 'text-green-600',
            symptoms: ['Pain at site', 'Swelling', 'Nausea', 'Difficulty breathing'],
            action: [
                'Keep person calm and still.',
                'Remove jewelry/tight clothing near bite.',
                'Keep bite area at or below heart level.',
                'Clean wound but don\'t flush with water.',
                'Get to hospital immediately.'
            ],
            avoid: ['Do not suck out venom.', 'Do not apply tourniquet.', 'Do not cut the wound.']
        },
        {
            id: 'hypothermia',
            title: 'Hypothermia',
            category: 'Environmental',
            icon: Thermometer,
            color: 'text-blue-400',
            symptoms: ['Shivering', 'Slurred speech', 'Slow breathing', 'Clumsiness'],
            action: [
                'Move to warm area.',
                'Remove wet clothing.',
                'Warm center of body first (chest/neck/head).',
                'Give warm, sweet non-alcoholic drink.'
            ],
            avoid: ['Do not use direct heat (hot water/lamp) - can cause shock.', 'Do not rub skin.']
        },
        {
            id: 'drowning',
            title: 'Near Drowning',
            category: 'Environmental',
            icon: Droplet,
            color: 'text-blue-500',
            symptoms: ['Coughing water', 'Cold skin', 'Blue lips', 'Unconscious'],
            action: [
                'Get person out of water safely.',
                'Check breathing.',
                'Start CPR if not breathing.',
                'Turn on side (recovery position) if breathing to drain fluid.',
                'Call Emergency Services.'
            ],
            avoid: ['Do not attempt rescue if unsafe for you.']
        },

        // MEDICAL
        {
            id: 'seizure',
            title: 'Seizure',
            category: 'Medical',
            icon: Activity,
            color: 'text-purple-500',
            symptoms: ['Uncontrollable shaking', 'Loss of consciousness', 'Stiffening'],
            action: [
                'Ease person to floor.',
                'Turn on side to help breathing.',
                'Clear area of hard objects.',
                'Place something soft under head.',
                'Time the seizure (Call 911 if >5 mins).'
            ],
            avoid: ['Do not hold them down.', 'Do not put anything in mouth.']
        },
        {
            id: 'allergic_reaction',
            title: 'Allergic Reaction (Anaphylaxis)',
            category: 'Medical',
            icon: ShieldAlert,
            color: 'text-red-500',
            symptoms: ['Swollen lips/tongue', 'Difficulty breathing', 'Hives', 'Dizziness'],
            action: [
                'Use EpiPen immediately if available.',
                'Call Emergency Services.',
                'Lay person flat with legs raised.',
                'Loosen tight clothing.'
            ],
            avoid: ['Do not wait to see if it improves.', 'Do not give oral meds if breathing is hard.']
        },
        {
            id: 'diabetic_low',
            title: 'Low Blood Sugar (Hypoglycemia)',
            category: 'Medical',
            icon: Activity,
            color: 'text-blue-400',
            symptoms: ['Shaking', 'Sweating', 'Hunger', 'Confusion'],
            action: [
                'Give fast-acting sugar (juice, candy, soda).',
                'Wait 15 mins, check if better.',
                'If unconscious, Call Emergency (do not feed).',
                'Follow with protein snack.'
            ],
            avoid: ['Do not give insulin.', 'Do not give diet soda (needs sugar).']
        },
        {
            id: 'asthma',
            title: 'Asthma Attack',
            category: 'Medical',
            icon: Wind,
            color: 'text-blue-300',
            symptoms: ['Wheezing', 'Tight chest', 'Breathlessness'],
            action: [
                'Sit person upright.',
                'Help them use inhaler (usually blue).',
                'Take 1 puff every minute (up to 10) if no improvement.',
                'Call Emergency if no relief.'
            ],
            avoid: ['Do not lie them down (makes breathing harder).']
        },

        // COMMON ISSUES
        {
            id: 'nosebleed',
            title: 'Nosebleed',
            category: 'Common',
            icon: Droplet,
            color: 'text-red-400',
            symptoms: ['Bleeding from nose'],
            action: [
                'Sit upright and lean forward.',
                'Pinch soft part of nose just below bone.',
                'Hold for 10-15 minutes continuously.',
                'Breathe through mouth.'
            ],
            avoid: ['Do not lean back (swallowing blood causes vomiting).', 'Do not pack nose with tissue.']
        },
        {
            id: 'faint',
            title: 'Fainting',
            category: 'Common',
            icon: Eye,
            color: 'text-slate-400',
            symptoms: ['Dizziness', 'Pale skin', 'Loss of vision', 'Collapse'],
            action: [
                'Lay person flat on back.',
                'Elevate legs 12 inches.',
                'Loosen tight clothing.',
                'Check breathing.',
                'Keep cool and quiet.'
            ],
            avoid: ['Do not stand them up too quickly.', 'Do not splash water on face.']
        },
        {
            id: 'electric_shock',
            title: 'Electric Shock',
            category: 'Trauma',
            icon: Zap,
            color: 'text-yellow-400',
            symptoms: ['Burns', 'Muscle contraction', 'Unconsciousness'],
            action: [
                'Turn off power source immediately.',
                'Do not touch person until power is off.',
                'Call Emergency Services.',
                'Start CPR if no breathing (after safe).'
            ],
            avoid: ['Do not touch person with bare hands if still connected.', 'Do not go near high voltage.']
        },
        {
            id: 'poison',
            title: 'Poisoning',
            category: 'Medical',
            icon: ShieldAlert,
            color: 'text-green-500',
            symptoms: ['Vomiting', 'Burns around mouth', 'Abdominal pain', 'Strange odor'],
            action: [
                'Call Poison Control / Emergency immediately.',
                'Remove contaminated clothing.',
                'If swallowed, flush mouth (if conscious).',
                'Identify the poison for responders.'
            ],
            avoid: ['Do not induce vomiting unless told to.', 'Do not neutralize with vinegar/milk unless told.']
        }
    ];

    const filteredTopics = topics.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-screen bg-slate-950 flex flex-col font-sans text-white selection:bg-red-500 selection:text-white">
            {/* Header */}
            <header className="relative z-10 bg-slate-950/80 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 -ml-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-red-500 font-bold">
                        +
                    </div>
                    <span className="font-bold text-white text-lg">First Aid Guide</span>
                </div>
                <div className="w-8" />
            </header>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full">

                {/* LIST PANEL */}
                <div className={`w-full md:w-1/3 p-4 border-r border-white/5 flex flex-col ${selectedTopic && 'hidden md:flex'}`}>
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        <input
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
                            placeholder="Search emergency..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {filteredTopics.map(topic => (
                            <button
                                key={topic.id}
                                onClick={() => setSelectedTopic(topic)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group
                                    ${selectedTopic?.id === topic.id
                                        ? 'bg-red-500/10 border-red-500/50'
                                        : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTopic?.id === topic.id ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'} transition-colors`}>
                                    <topic.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`font-bold ${selectedTopic?.id === topic.id ? 'text-red-400' : 'text-slate-200'}`}>{topic.title}</h3>
                                    <span className="text-xs text-slate-500 font-medium">{topic.category}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* DETAIL PANEL */}
                <div className={`w-full md:w-2/3 p-6 md:p-10 flex flex-col ${!selectedTopic && 'hidden md:flex'}`}>
                    <AnimatePresence mode="wait">
                        {selectedTopic ? (
                            <motion.div
                                key={selectedTopic.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col"
                            >
                                <button onClick={() => setSelectedTopic(null)} className="md:hidden flex items-center gap-2 text-slate-400 mb-6">
                                    <ArrowLeft className="w-4 h-4" /> Back to list
                                </button>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-800 ${selectedTopic.color}`}>
                                        <selectedTopic.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white">{selectedTopic.title}</h2>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/5 mt-2 ${selectedTopic.color} border border-white/5`}>
                                            {selectedTopic.category} Protocol
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-6 md:pr-10 pb-20">
                                    {/* Symptoms */}
                                    <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5">
                                        <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                                            <Eye className="w-5 h-5 text-slate-500" /> Spot the Signs
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTopic.symptoms.map((sym, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 text-sm border border-white/5">
                                                    {sym}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Steps */}
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 rounded-3xl p-6 border border-green-500/20 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -z-10" />
                                        <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                            <Zap className="w-6 h-6" /> Immediate Action
                                        </h3>
                                        <div className="space-y-4">
                                            {selectedTopic.action.map((step, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm shrink-0 border border-green-500/20">
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-lg text-white leading-snug pt-1">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Avoid */}
                                    <div className="bg-red-900/10 rounded-3xl p-6 border border-red-500/20">
                                        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                                            <ShieldAlert className="w-5 h-5" /> What NOT to do
                                        </h3>
                                        <ul className="space-y-2">
                                            {selectedTopic.avoid.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-red-200/80">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="text-center pt-8 text-slate-500 text-xs">
                                        Disclaimer: This guide is for information only. Always prioritize calling professional responders.
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <Heart className="w-16 h-16 text-slate-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Select an Emergency</h2>
                                <p className="text-slate-400 max-w-xs">Review instructions now so you are ready when it matters.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FirstAidGuide;
