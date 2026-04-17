/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, PipelineStage, LeadSource, ActivityType } from '../types';
import { PIPELINE_STAGES } from '../constants';
import { 
  X, 
  Save, 
  Trash2, 
  MessageSquare, 
  Phone, 
  Mail, 
  Users, 
  Plus,
  Clock,
  FileText
} from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface LeadModalProps {
  lead?: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  onDelete?: (id: string) => void;
  initialStage?: PipelineStage;
}

export default function LeadModal({ lead, isOpen, onClose, onSave, onDelete, initialStage }: LeadModalProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    rfqNumber: '',
    drawingNumber: '',
    partName: '',
    projectName: '',
    source: 'Website',
    value: 0,
    followUpDate: new Date().toISOString().split('T')[0],
    status: initialStage || 'RFQ Received',
    notes: '',
    activities: []
  });

  const [activeTab, setActiveTab] = useState<'details' | 'activities'>('details');
  const [newActivity, setNewActivity] = useState({ type: 'Note' as ActivityType, content: '' });

  useEffect(() => {
    if (lead) {
      setFormData(lead);
      setActiveTab('details');
    } else {
      setFormData({
        customerName: '',
        companyName: '',
        email: '',
        phone: '',
        rfqNumber: `RFQ-${Math.floor(Math.random() * 10000)}`,
        drawingNumber: '',
        partName: '',
        projectName: '',
        source: 'Website',
        value: 0,
        followUpDate: new Date().toISOString().split('T')[0],
        status: initialStage || 'RFQ Received',
        notes: '',
        activities: []
      });
    }
  }, [lead, initialStage, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData as Lead,
      id: lead?.id || Math.random().toString(36).substr(2, 9),
      createdAt: lead?.createdAt || new Date().toISOString(),
    });
  };

  const addActivity = () => {
    if (!newActivity.content.trim()) return;
    const activity = {
      id: Math.random().toString(36).substr(2, 9),
      type: newActivity.type,
      content: newActivity.content,
      timestamp: new Date().toISOString()
    };
    setFormData(prev => ({
      ...prev,
      activities: [activity, ...(prev.activities || [])]
    }));
    setNewActivity({ type: 'Note', content: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-border-main dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {lead ? 'Edit Deal' : 'New Lead Opportunity'}
            </h2>
            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => setActiveTab('details')}
                className={cn(
                  "text-[0.7rem] uppercase tracking-widest font-black transition-all",
                  activeTab === 'details' ? "text-primary-700 border-b-2 border-primary-700 pb-1" : "text-zinc-400"
                )}
              >
                Lead Details
              </button>
              {lead && (
                <button 
                  onClick={() => setActiveTab('activities')}
                  className={cn(
                    "text-[0.7rem] uppercase tracking-widest font-black transition-all",
                    activeTab === 'activities' ? "text-primary-700 border-b-2 border-primary-700 pb-1" : "text-zinc-400"
                  )}
                >
                  Activity Log ({formData.activities?.length || 0})
                </button>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-content-bg dark:bg-zinc-900">
          {activeTab === 'details' ? (
            <form id="lead-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Core Information Section */}
              <section className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-border-main dark:border-zinc-700 space-y-4 shadow-sm">
                <h3 className="text-[0.7rem] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-50 dark:border-zinc-700 pb-2">
                   Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Contact Name</label>
                    <input 
                      required
                      value={formData.customerName}
                      onChange={e => setFormData({...formData, customerName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Company Name</label>
                    <input 
                      required
                      value={formData.companyName}
                      onChange={e => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Email Address</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Phone Number</label>
                    <input 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Project Details Section */}
              <section className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-border-main dark:border-zinc-700 space-y-4 shadow-sm">
                <h3 className="text-[0.7rem] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-50 dark:border-zinc-700 pb-2">
                   RFQ & Project Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Part Name</label>
                    <input 
                      required
                      value={formData.partName}
                      onChange={e => setFormData({...formData, partName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Drawing Number</label>
                    <input 
                      value={formData.drawingNumber}
                      onChange={e => setFormData({...formData, drawingNumber: e.target.value})}
                      className="w-full px-4 py-2.5 font-mono bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Project Name</label>
                    <input 
                      value={formData.projectName}
                      onChange={e => setFormData({...formData, projectName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Lead Source</label>
                    <select 
                      value={formData.source}
                      onChange={e => setFormData({...formData, source: e.target.value as LeadSource})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none appearance-none"
                    >
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Event">Event</option>
                      <option value="Cold Call">Cold Call</option>
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Commercials Section */}
              <section className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-border-main dark:border-zinc-700 space-y-4 shadow-sm">
                <h3 className="text-[0.7rem] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-50 dark:border-zinc-700 pb-2">
                   Commercials & Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Quotation Value (₹)</label>
                    <input 
                      type="number"
                      required
                      value={formData.value}
                      onChange={e => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Follow-up Date</label>
                    <input 
                      type="date"
                      required
                      value={formData.followUpDate}
                      onChange={e => setFormData({...formData, followUpDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                  <div className="col-span-full space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Pipeline Status</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {PIPELINE_STAGES.map(stage => (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => setFormData({...formData, status: stage})}
                          className={cn(
                            "px-3 py-2 text-xs font-bold rounded-lg border transition-all",
                            formData.status === stage 
                              ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20" 
                              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-primary-300"
                          )}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-primary-50/50 dark:bg-primary-950/20 p-6 rounded-2xl space-y-4 border border-primary-100 dark:border-primary-900/50">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <Plus className="text-primary-600" size={18} /> 
                  Log New Activity
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {(['Call', 'WhatsApp', 'Meeting', 'Email', 'Note'] as ActivityType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setNewActivity({...newActivity, type})}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5",
                        newActivity.type === type 
                          ? "bg-primary-600 border-primary-600 text-white" 
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400"
                      )}
                    >
                      {type === 'Call' && <Phone size={12} />}
                      {type === 'WhatsApp' && <MessageSquare size={12} />}
                      {type === 'Meeting' && <Users size={12} />}
                      {type === 'Email' && <Mail size={12} />}
                      {type}
                    </button>
                  ))}
                </div>
                <textarea 
                  value={newActivity.content}
                  onChange={e => setNewActivity({...newActivity, content: e.target.value})}
                  placeholder="Record what happened during this interaction..."
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none min-h-[100px]"
                />
                <button 
                  onClick={addActivity}
                  disabled={!newActivity.content.trim()}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  Save Activity
                </button>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Past History</h3>
                <div className="space-y-4">
                  {formData.activities?.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400">
                      <History size={48} className="mx-auto mb-4 opacity-10" />
                      <p>No activities logged yet.</p>
                    </div>
                  ) : (
                    formData.activities?.map((activity) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                            {activity.type === 'Call' && <Phone size={14} />}
                            {activity.type === 'WhatsApp' && <MessageSquare size={14} />}
                            {activity.type === 'Meeting' && <Users size={14} />}
                            {activity.type === 'Email' && <Mail size={14} />}
                            {activity.type === 'Note' && <FileText size={14} />}
                          </div>
                          <div className="flex-1 w-px bg-zinc-200 dark:bg-zinc-800 mt-2" />
                        </div>
                        <div className="flex-1 pb-6 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold">{activity.type}</span>
                            <span className="text-xs text-zinc-400">{formatDate(activity.timestamp)}</span>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-800/30 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            {activity.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-border-main bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0">
          {lead && onDelete ? (
            <button 
              onClick={() => onDelete(lead.id)}
              className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
            >
              <Trash2 size={20} />
            </button>
          ) : <div />}
          
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded font-bold text-zinc-500 hover:text-zinc-900 text-[0.85rem]"
            >
              Cancel
            </button>
            <button 
              form="lead-form"
              type="submit"
              className="px-8 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded font-bold flex items-center gap-2 shadow-sm transition-all text-[0.85rem]"
            >
              <Save size={18} />
              Save Record
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function History({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="m12 7v5l4 2"/>
    </svg>
  );
}
