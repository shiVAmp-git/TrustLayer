import React, { useState } from 'react';
import { X } from 'lucide-react';

const ConsentModal = ({ organization, onClose, onConfirm }) => {
    const [purpose, setPurpose] = useState('Healthcare');
    const [days, setDays] = useState(7);

    const handleSubmit = (e) => {
        e.preventDefault();
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + parseInt(days));
        onConfirm({
            org_id: organization.id,
            purpose,
            expiration_date: expiration.toISOString(),
            user_id: 'default_user'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Grant Data Access</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 underline">Organization</label>
                        <p className="text-xl font-semibold">{organization.name}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Access Purpose</label>
                        <select
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Research">Research</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Duration (Days)</label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl transition-all"
                        >
                            Confirm Access
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConsentModal;
