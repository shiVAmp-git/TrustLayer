import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, RefreshCw } from 'lucide-react';
import Dashboard from './components/Dashboard';
import OrganizationList from './components/OrganizationList';
import AccessLogViewer from './components/AccessLogViewer';
import ConsentModal from './components/ConsentModal';

const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '/api');

function App() {
  const [organizations, setOrganizations] = useState([]);
  const [consents, setConsents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [orgsRes, consentsRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE}/organizations`),
        axios.get(`${API_BASE}/consents`),
        axios.get(`${API_BASE}/logs`)
      ]);
      setOrganizations(orgsRes.data);
      setConsents(consentsRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll for log updates
    return () => clearInterval(interval);
  }, []);

  const handleGrant = (org) => {
    setSelectedOrg(org);
    setShowModal(true);
  };

  const handleConfirmConsent = async (consentData) => {
    try {
      await axios.post(`${API_BASE}/consents`, consentData);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Error granting consent');
    }
  };

  const handleRevoke = async (consentId) => {
    try {
      await axios.delete(`${API_BASE}/consents/${consentId}`);
      fetchData();
    } catch (err) {
      alert('Error revoking consent');
    }
  };

  const simulateAccess = async (orgId, purpose) => {
    try {
      await axios.post(`${API_BASE}/simulate-access`, { org_id: orgId, purpose });
      fetchData();
    } catch (err) {
      console.error('Simulation failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-dark flex items-center justify-center">
        <RefreshCw className="text-blue-400 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-dark text-premium-text p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Trust<span className="gradient-text">Layer</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => simulateAccess(1, 'Marketing')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all text-gray-400"
            >
              Simulate Violation (Org 1)
            </button>
          </div>
        </header>

        <Dashboard consents={consents} logs={logs} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <OrganizationList
            organizations={organizations}
            consents={consents}
            onGrant={handleGrant}
            onRevoke={handleRevoke}
          />
          <AccessLogViewer logs={logs} />
        </div>

        {showModal && (
          <ConsentModal
            organization={selectedOrg}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmConsent}
          />
        )}

        <footer className="mt-20 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
          &copy; 2026 GuardianLayer Autonomous Consent Platform. Secure. Transparent. Agentic.
        </footer>
      </div>
    </div>
  );
}

export default App;
