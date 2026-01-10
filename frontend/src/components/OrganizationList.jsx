import React from 'react';
import { Plus, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';

const OrganizationList = ({ organizations, consents, onGrant, onRevoke }) => {
    return (
        <div className="glass rounded-2xl overflow-hidden mb-8">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold">Trusted Organizations</h2>
            </div>
            <div className="divide-y divide-white/10">
                {organizations.map(org => {
                    const activeConsent = consents.find(c => c.org_id === org.id);
                    return (
                        <div key={org.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div>
                                <h3 className="font-semibold text-lg">{org.name}</h3>
                                <p className="text-gray-400 text-sm">{org.description}</p>
                                {activeConsent && (
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                                            <ShieldCheck size={12} /> {activeConsent.purpose}
                                        </span>
                                        <span className="text-gray-500">Expires: {new Date(activeConsent.expiration_date).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                {activeConsent ? (
                                    <button
                                        onClick={() => onRevoke(activeConsent.id)}
                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        title="Revoke Consent"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onGrant(org)}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all font-medium"
                                    >
                                        <Plus size={18} /> Grant access
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrganizationList;
