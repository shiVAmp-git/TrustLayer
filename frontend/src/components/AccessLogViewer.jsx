import React from 'react';
import { Clock, CheckCircle2, XCircle, Info, ShieldOff } from 'lucide-react';

const AccessLogViewer = ({ logs }) => {
    return (
        <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold">Access Transparency Log</h2>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Live Monitoring</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 font-medium">Org ID</th>
                            <th className="px-6 py-3 font-medium">Purpose</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Timestamp</th>
                            <th className="px-6 py-3 font-medium">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium">#{log.org_id}</td>
                                <td className="px-6 py-4 text-sm">{log.requested_purpose}</td>
                                <td className="px-6 py-4 text-sm">
                                    {log.status === 'Granted' && (
                                        <span className="text-green-400 flex items-center gap-1 font-semibold">
                                            <CheckCircle2 size={14} /> Granted
                                        </span>
                                    )}
                                    {log.status === 'Denied' && (
                                        <span className="text-red-400 flex items-center gap-1 font-semibold">
                                            <XCircle size={14} /> Denied
                                        </span>
                                    )}
                                    {log.status === 'REVOKED' && (
                                        <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                                            <ShieldOff size={14} /> AI Revoke
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400 truncate max-w-xs" title={log.reason}>
                                    {log.reason}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">No access logs recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccessLogViewer;
