/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead } from '../types';
import { 
  MoreVertical, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  PhoneCall, 
  Calendar,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { useState } from 'react';

interface LeadsListProps {
  leads: Lead[];
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
}

export default function LeadsList({ leads, onAddLead, onEditLead }: LeadsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLeads = leads.filter(lead => 
    lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.partName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Order Won': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Order Lost': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Negotiation': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Quotation Submitted': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Lead Directory</h1>
          <p className="text-zinc-500 mt-1">Manage all your customer RFQs and contacts.</p>
        </div>
        <button
          onClick={onAddLead}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/20"
        >
          <Plus size={20} />
          New Lead
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex gap-4 p-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search leads, companies, parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
        <button className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-400">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 border border-border-main dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800 border-b border-border-main dark:border-zinc-800">
                <th className="px-6 py-4 text-[0.7rem] font-extrabold text-zinc-500 uppercase tracking-widest leading-none">Customer / Company</th>
                <th className="px-6 py-4 text-[0.7rem] font-extrabold text-zinc-500 uppercase tracking-widest leading-none">Part Info</th>
                <th className="px-6 py-4 text-[0.7rem] font-extrabold text-zinc-500 uppercase tracking-widest leading-none">Value</th>
                <th className="px-6 py-4 text-[0.7rem] font-extrabold text-zinc-500 uppercase tracking-widest leading-none">Status</th>
                <th className="px-6 py-4 text-[0.7rem] font-extrabold text-zinc-500 uppercase tracking-widest leading-none">Next Follow-up</th>
                <th className="px-6 py-4 text-[0.7rem] font-extrabold text-zinc-500 uppercase tracking-widest leading-none"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                  onClick={() => onEditLead(lead)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-[0.9rem] text-zinc-900 dark:text-zinc-50">{lead.customerName}</div>
                      <div className="text-[0.75rem] text-zinc-500">{lead.companyName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[200px]">
                      <div className="text-[0.8rem] font-bold text-zinc-700 dark:text-zinc-300 truncate">{lead.partName}</div>
                      <div className="text-[0.7rem] font-mono font-bold text-zinc-400">{lead.rfqNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[0.9rem] font-black text-primary-700">{formatCurrency(lead.value)}</div>
                    <div className="text-[0.7rem] font-bold text-zinc-400 uppercase tracking-wide">{lead.source}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-black uppercase tracking-wider",
                      getStatusColor(lead.status)
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-500">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                       {formatDate(lead.followUpDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-300 hover:text-zinc-600 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/30 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-sm text-zinc-500">Showing {filteredLeads.length} leads</span>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg opacity-50 cursor-not-allowed"><ChevronLeft size={16} /></button>
            <button className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
