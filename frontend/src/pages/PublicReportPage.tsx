import React, { useState } from 'react';
import { Globe, Search, CheckCircle2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../components/branding/Logo';
import Footer from '../components/layout/Footer';

export const PublicReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  
  // Submit Form
  const [personName, setPersonName] = useState('');
  const [age, setAge] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // Track Form
  const [trackCode, setTrackCode] = useState('');
  const [trackedStatus, setTrackedStatus] = useState<any | null>(null);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `PUB-REF-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedCode(code);
  };

  const handleTrackReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackCode.trim()) {
      setTrackedStatus({
        code: trackCode.toUpperCase(),
        name: 'Aarav Sharma',
        status: 'RECEIVED & UNDER REVIEW',
        assignedAgency: 'Delhi Police Missing Persons Bureau',
        lastUpdated: '2026-09-07 14:00'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="full" theme="dark" size="lg" showTagline={true} />
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Public Citizens Portal (Encrypted Submission Channel)</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-white">KhojSetu Public Missing Person Report Portal</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Submit a missing person report to participating law enforcement agencies, or check your report status using your unique reference tracking code.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'submit'
                ? 'bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 text-white shadow-lg'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Submit New Missing Report
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'track'
                ? 'bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 text-white shadow-lg'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Track Case Status via Reference Code
          </button>
        </div>

        {/* Tab 1: Submit Report */}
        {activeTab === 'submit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {submittedCode ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Missing Person Report Received</h3>
                <p className="text-xs text-slate-300">
                  Your report has been securely transmitted to the investigating authority. Keep this tracking reference code safe:
                </p>
                <div className="inline-block bg-slate-950 px-6 py-3 rounded-xl border border-cyan-500/50 font-mono text-xl font-bold text-cyan-400">
                  {submittedCode}
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmittedCode(null);
                      setPersonName('');
                    }}
                    className="text-xs text-cyan-400 hover:underline font-semibold"
                  >
                    Submit Another Report
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <h3 className="font-bold text-white text-sm pb-2 border-b border-slate-800">
                  1. Missing Individual Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name of Missing Person *</label>
                    <input
                      type="text"
                      required
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Approximate Age *</label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Seen Location & Circumstances *</label>
                  <input
                    type="text"
                    required
                    value={lastLocation}
                    onChange={(e) => setLastLocation(e.target.value)}
                    placeholder="e.g. Railway Station Platform 4, New Delhi"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500"
                  />
                </div>

                <h3 className="font-bold text-white text-sm pb-2 border-b border-slate-800 pt-3">
                  2. Reporter Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Reporter Name"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  Submit Official Missing Report <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Track Status */}
        {activeTab === 'track' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <form onSubmit={handleTrackReport} className="flex items-center gap-3">
              <input
                type="text"
                required
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                placeholder="Enter Reference Code (e.g. PUB-REF-9021)"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md"
              >
                Track Status
              </button>
            </form>

            {trackedStatus && (
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-400 text-sm">{trackedStatus.code}</span>
                  <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded">
                    {trackedStatus.status}
                  </span>
                </div>

                <div><strong>Person Name:</strong> {trackedStatus.name}</div>
                <div><strong>Assigned Agency:</strong> {trackedStatus.assignedAgency}</div>
                <div className="text-[11px] text-slate-500">Last System Update: {trackedStatus.lastUpdated}</div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PublicReportPage;
