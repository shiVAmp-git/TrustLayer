import React from 'react';
import { Shield, Activity, Lock, ToggleLeft } from 'lucide-react';

const Dashboard = ({ consents, logs }) => {
    const activeConsents = consents.length;
    const recentViolations = logs.filter(l => l.status === 'REVOKED' || (l.status === 'Denied' && l.reason.includes('Purpose'))).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Shield className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-gray-400 font-medium">Active Consents</h3>
                </div>
                <p className="text-3xl font-bold">{activeConsents}</p>
            </div>

            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Activity className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-gray-400 font-medium">Guardian Status</h3>
                </div>
                <p className="text-3xl font-bold text-green-400">Monitoring</p>
            </div>

            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-red-500/20 rounded-lg">
                        <Lock className="text-red-400" size={24} />
                    </div>
                    <h3 className="text-gray-400 font-medium">Prevented Violations</h3>
                </div>
                <p className="text-3xl font-bold text-red-400">{recentViolations}</p>
            </div>
        </div>
    );
};

export default Dashboard;
