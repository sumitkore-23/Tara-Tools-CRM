/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadsList from './components/LeadsList';
import PipelineBoard from './components/PipelineBoard';
import LeadModal from './components/LeadModal';
import { Lead, PipelineStage } from './types';
import { MOCK_LEADS } from './constants';
import { AnimatePresence, motion } from 'motion/react';
import { History, LayoutDashboard, Search, Users } from 'lucide-react';
import { formatDate } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [initialStage, setInitialStage] = useState<PipelineStage | undefined>();

  // Initialize data
  useEffect(() => {
    const savedLeads = localStorage.getItem('tara_tools_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    } else {
      setLeads(MOCK_LEADS);
    }
  }, []);

  // Persist data
  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('tara_tools_leads', JSON.stringify(leads));
    }
  }, [leads]);

  const handleAddLead = (stage?: PipelineStage) => {
    setInitialStage(stage);
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleSaveLead = (lead: Lead) => {
    const exists = leads.find(l => l.id === lead.id);
    if (exists) {
      setLeads(leads.map(l => l.id === lead.id ? lead : l));
    } else {
      setLeads([lead, ...leads]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setLeads(leads.filter(l => l.id !== id));
      setIsModalOpen(false);
    }
  };

  const handleMoveLead = (leadId: string, newStage: PipelineStage) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStage } : l));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard leads={leads} />;
      case 'leads':
        return (
          <LeadsList 
            leads={leads} 
            onAddLead={() => handleAddLead()} 
            onEditLead={handleEditLead} 
          />
        );
      case 'pipeline':
        return (
          <PipelineBoard 
            leads={leads} 
            onAddLead={handleAddLead} 
            onEditLead={handleEditLead}
            onMoveLead={handleMoveLead}
          />
        );
      case 'activities':
        const allActivities = leads.flatMap(l => 
          l.activities.map(a => ({ ...a, leadName: l.customerName, company: l.companyName }))
        ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Activity Timeline</h1>
                <p className="text-zinc-500 mt-1">Full interaction history across all deals.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 max-w-3xl">
              <div className="space-y-8">
                {allActivities.map(activity => (
                  <div key={activity.id} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                        {activity.type === 'Call' && <History size={18} />}
                        {activity.type === 'WhatsApp' && <Users size={18} />}
                        {activity.type === 'Meeting' && <LayoutDashboard size={18} />}
                      </div>
                      <div className="flex-1 w-px bg-zinc-100 dark:bg-zinc-800 mt-3" />
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{activity.type}</span>
                        <span className="text-xs text-zinc-400 font-medium">{formatDate(activity.timestamp)}</span>
                      </div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-50 mb-1">{activity.leadName} · {activity.company}</h4>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm">{activity.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard leads={leads} />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F5F5F5] dark:bg-zinc-950">
        {/* Header Rail */}
        <header className="h-16 shrink-0 border-b border-border-main bg-white dark:bg-zinc-900 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-full max-w-md hidden md:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Searching for RFQs, Parts..." 
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded py-2 pl-9 pr-4 text-[0.85rem] focus:ring-1 focus:ring-primary-500/20 transition-all outline-none"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
               onClick={() => handleAddLead()}
               className="bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded text-[0.85rem] font-bold transition-all shadow-sm"
            >
              + Create New Lead
            </button>
            <div className="flex items-center gap-3 ml-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold">Sumit Kore</span>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Admin</span>
              </div>
              <div className="w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-800">
                <img src="https://picsum.photos/seed/sumit/32/32" className="w-full h-full rounded object-cover" alt="User" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <LeadModal 
            isOpen={isModalOpen}
            lead={editingLead}
            initialStage={initialStage}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveLead}
            onDelete={handleDeleteLead}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
