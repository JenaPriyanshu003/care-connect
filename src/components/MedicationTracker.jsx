import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Clock, CheckCircle, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MedicationTracker = () => {
    const navigate = useNavigate();
    const [meds, setMeds] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newMed, setNewMed] = useState({ name: '', time: '' });

    // Load from MongoDB
    useEffect(() => {
        fetchMeds();
    }, []);

    const fetchMeds = async () => {
        try {
            const res = await fetch('/api/medications');
            if (res.ok) {
                const data = await res.json();
                setMeds(data.map(m => ({ ...m, id: m._id }))); // Map _id to id for UI consistency
            }
        } catch (error) {
            console.error("Failed to fetch meds", error);
        }
    };

    const addMed = async () => {
        if (!newMed.name || !newMed.time) return;

        try {
            const res = await fetch('/api/medications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newMed, taken: false })
            });

            if (res.ok) {
                await fetchMeds(); // Refresh list
                setNewMed({ name: '', time: '' });
                setShowForm(false);
            }
        } catch (error) {
            console.error("Failed to add med", error);
        }
    };

    const toggleTaken = async (id) => {
        const med = meds.find(m => m.id === id);
        if (!med) return;

        try {
            const res = await fetch(`/api/medications?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taken: !med.taken })
            });

            if (res.ok) fetchMeds();
        } catch (error) {
            console.error("Failed to toggle med", error);
        }
    };

    const deleteMed = async (id) => {
        try {
            const res = await fetch(`/api/medications?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) fetchMeds();
        } catch (error) {
            console.error("Failed to delete med", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white px-4 py-3 border-b flex items-center justify-between shadow-sm">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="text-gray-600" />
                </button>
                <h1 className="font-bold text-gray-800">Pill Tracker</h1>
                <div className="w-8" />
            </header>

            <div className="flex-grow p-4 max-w-md mx-auto w-full">
                {/* Empty State */}
                {meds.length === 0 && !showForm && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Pill className="w-10 h-10 text-gray-300" />
                        </div>
                        <p>No medications added</p>
                    </div>
                )}

                {/* List */}
                <div className="space-y-3 mb-24">
                    <AnimatePresence>
                        {meds.map(med => (
                            <motion.div
                                key={med.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                                className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-colors ${med.taken ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleTaken(med.id)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${med.taken
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-gray-300 text-transparent hover:border-green-500'
                                            }`}
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h3 className={`font-bold text-lg ${med.taken ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{med.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            {med.time}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => deleteMed(med.id)} className="text-gray-400 hover:text-red-500 p-2">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Float Action Button */}
            <button
                onClick={() => setShowForm(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg shadow-green-300 flex items-center justify-center hover:bg-green-700 hover:scale-105 active:scale-95 transition-all z-20"
            >
                <Plus className="w-8 h-8" />
            </button>

            {/* Add Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 sm:p-0"
                    >
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Add Medication</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Medicine Name</label>
                                    <input
                                        autoFocus
                                        className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Malarone"
                                        value={newMed.name}
                                        onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                                    <input
                                        type="time"
                                        className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"
                                        value={newMed.time}
                                        onChange={e => setNewMed({ ...newMed, time: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addMed}
                                        className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicationTracker;
