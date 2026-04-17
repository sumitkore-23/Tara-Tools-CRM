/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, PipelineStage } from '../types';
import { PIPELINE_STAGES } from '../constants';
import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PipelineBoardProps {
  leads: Lead[];
  onAddLead: (stage?: PipelineStage) => void;
  onEditLead: (lead: Lead) => void;
  onMoveLead: (leadId: string, newStage: PipelineStage) => void;
}

export default function PipelineBoard({ leads, onAddLead, onEditLead, onMoveLead }: PipelineBoardProps) {
  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Deal Pipeline</h1>
          <p className="text-zinc-500 mt-1">Track the journey from RFQ to Purchase Order.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 overflow-hidden">
                <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="User" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <button
            onClick={() => onAddLead()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all"
          >
            <Plus size={18} />
            Add Deal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4 h-full min-w-max">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leads.filter(l => l.status === stage);
            const totalValue = stageLeads.reduce((acc, l) => acc + l.value, 0);

            return (
              <div key={stage} className="w-80 flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1 shrink-0 border-b-2 border-border-main pb-2">
                  <h3 className="font-extrabold text-zinc-500 text-[0.8rem] uppercase tracking-wide">{stage}</h3>
                  <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 px-1 pt-1">
                  <AnimatePresence mode="popLayout">
                    {stageLeads.map((lead) => (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-zinc-900 p-4 rounded-md border border-border-main dark:border-zinc-800 border-l-4 border-l-primary-600 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                        onClick={() => onEditLead(lead)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-[0.9rem] text-zinc-900 dark:text-zinc-50 leading-tight">{lead.partName}</h4>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = PIPELINE_STAGES.indexOf(stage);
                                if (currentIndex < PIPELINE_STAGES.length - 1) {
                                  onMoveLead(lead.id, PIPELINE_STAGES[currentIndex + 1]);
                                }
                              }}
                              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-primary-600"
                              title="Move forward"
                            >
                                <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>

                        <p className="text-[0.75rem] text-zinc-500 mb-3">{lead.companyName} | {lead.rfqNumber}</p>

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-dashed border-zinc-100 dark:border-zinc-800">
                          <div className="font-bold text-[0.85rem] text-primary-700">
                            {formatCurrency(lead.value)}
                          </div>
                          
                          <div className={cn(
                            "flex items-center gap-1 text-[0.65rem] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800",
                            new Date(lead.followUpDate) < new Date() ? "text-red-600" : "text-zinc-500"
                          )}>
                            {new Date(lead.followUpDate) < new Date() && <div className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                            {formatDate(lead.followUpDate)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button 
                    onClick={() => onAddLead(stage)}
                    className="w-full py-3 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add Lead
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size }: { size: number }) {
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
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
