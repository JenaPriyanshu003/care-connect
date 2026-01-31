import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, ExternalLink, Siren, Stethoscope, Pill, Hospital } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmergencyFinder = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getLocation = () => {
        setLoading(true);
        setError('');
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLoading(false);
            },
            (error) => {
                setError("Unable to retrieve your location. Please enable GPS.");
                setLoading(false);
            }
        );
    };

    const emergencyOptions = [
        {
            name: 'Hospitals',
            icon: Hospital,
            color: 'text-red-500',
            bg: 'bg-red-50 group-hover:bg-red-100',
            border: 'hover:border-red-200',
            desc: 'Trauma & Emergency',
            query: 'hospital'
        },
        {
            name: 'Pharmacies',
            icon: Pill,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 group-hover:bg-emerald-100',
            border: 'hover:border-emerald-200',
            desc: 'Medicine & Supplies',
            query: 'pharmacy'
        },
        {
            name: 'Clinics',
            icon: Stethoscope,
            color: 'text-blue-500',
            bg: 'bg-blue-50 group-hover:bg-blue-100',
            border: 'hover:border-blue-200',
            desc: 'General Practice',
            query: 'clinic'
        },
        {
            name: 'Ambulance',
            icon: Siren,
            color: 'text-orange-500',
            bg: 'bg-orange-50 group-hover:bg-orange-100',
            border: 'hover:border-orange-200',
            desc: 'Urgent Transport',
            query: 'ambulance service'
        },
    ];

    return (
        <div className="h-screen bg-[#f8fafc] flex flex-col font-sans overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-red-100/40 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />
            </div>

            <header className="relative z-10 bg-white/80 backdrop-blur-md px-8 py-5 border-b border-gray-100/50 flex items-center justify-between shrink-0">
                <button
                    onClick={() => navigate('/')}
                    className="p-2.5 hover:bg-white rounded-full text-slate-500 hover:text-slate-800 transition-all shadow-sm border border-transparent hover:border-gray-100 active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                        <Siren className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Emergency Finder</span>
                </div>
                <div className="w-10" />
            </header>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-10 relative"
                >
                    {/* Premium Pulse Effect */}
                    <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-[-15px] bg-red-500/5 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />

                    <div className="relative bg-white p-8 rounded-full shadow-2xl shadow-red-100 border border-white">
                        <MapPin className="w-16 h-16 text-red-500 drop-shadow-sm" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 max-w-md mx-auto"
                >
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Nearest Aid Radar</h2>
                    <p className="text-slate-500 text-lg">
                        Instantly locate reliable medical help around you using high-precision GPS.
                    </p>
                </motion.div>

                {error && (
                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-red-50 text-red-600 px-6 py-4 rounded-xl mb-6 shadow-sm border border-red-100 font-medium">
                        {error}
                    </motion.div>
                )}

                {!location ? (
                    <motion.button
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={getLocation}
                        disabled={loading}
                        className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-red-200 transition-all"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Scanning Area...
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-5 h-5" />
                                    Locate Nearby Help
                                </>
                            )}
                        </span>
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-5 px-4"
                    >
                        {emergencyOptions.map((option, idx) => (
                            <a
                                key={idx}
                                href={`https://www.google.com/maps/search/${option.query}/@${location.lat},${location.lng},14z`}
                                target="_blank"
                                rel="noreferrer"
                                className={`group p-6 bg-white border border-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between ${option.border}`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 ${option.bg} rounded-2xl flex items-center justify-center transition-colors`}>
                                        <option.icon className={`w-7 h-7 ${option.color}`} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-slate-900 text-lg group-hover:text-slate-700 transition-colors">{option.name}</div>
                                        <div className="text-sm text-slate-500 font-medium">{option.desc}</div>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <ExternalLink className="w-5 h-5" />
                                </div>
                            </a>
                        ))}
                    </motion.div>
                )}

                {location && (
                    <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        onClick={() => setLocation(null)}
                        className="mt-8 text-slate-400 text-sm hover:text-red-500 transition-colors font-medium flex items-center gap-2"
                    >
                        <MapPin className="w-3 h-3" /> Update Location
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default EmergencyFinder;
