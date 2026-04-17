/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  IndianRupee,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Lead } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

interface DashboardProps {
  leads: Lead[];
}

export default function Dashboard({ leads }: DashboardProps) {
  const totalValue = leads.reduce((acc, lead) => acc + lead.value, 0);
  const wonDeals = leads.filter(l => l.status === 'Order Won');
  const winRate = leads.length > 0 ? (wonDeals.length / leads.length) * 100 : 0;
  
  const stageData = [
    { name: 'RFQ', value: leads.filter(l => l.status === 'RFQ Received').length },
    { name: 'Technical', value: leads.filter(l => l.status === 'Technical Discussion').length },
    { name: 'Quoted', value: leads.filter(l => l.status === 'Quotation Submitted').length },
    { name: 'Negotiation', value: leads.filter(l => l.status === 'Negotiation').length },
    { name: 'Won', value: wonDeals.length },
    { name: 'Lost', value: leads.filter(l => l.status === 'Order Lost').length },
  ];

  const sourceData = [
    { name: 'Event', value: leads.filter(l => l.source === 'Event').length },
    { name: 'Referral', value: leads.filter(l => l.source === 'Referral').length },
    { name: 'Website', value: leads.filter(l => l.source === 'Website').length },
    { name: 'Cold Call', value: leads.filter(l => l.source === 'Cold Call').length },
    { name: 'LinkedIn', value: leads.filter(l => l.source === 'LinkedIn').length },
  ].filter(d => d.value > 0);

  const stats = [
    { label: 'Pipeline Value', value: formatCurrency(totalValue), icon: IndianRupee, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Deals', value: leads.length, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Activities', value: leads.reduce((acc, l) => acc + l.activities.length, 0), icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sales Dashboard</h1>
        <p className="text-zinc-500 mt-1">Real-time performance metrics for Tara Tools.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-white dark:bg-zinc-900 rounded-lg border border-border-main dark:border-zinc-800 shadow-sm"
          >
            <div className="text-[0.7rem] uppercase tracking-widest font-bold text-zinc-500 mb-2">{stat.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-xl font-black text-primary-700 dark:text-primary-500">{stat.value}</div>
              <div className={cn("p-1.5 rounded bg-zinc-50 dark:bg-zinc-800")}>
                <stat.icon className="text-zinc-600 dark:text-zinc-400" size={16} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Chart */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Pipeline by Stage</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Lost' ? '#ef4444' : entry.name === 'Won' ? '#22c55e' : '#ea580c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sources Chart */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Lead Sources</h3>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-10">
              {sourceData.map((source, i) => (
                <div key={source.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{source.name}</span>
                  <span className="text-sm font-bold ml-auto">{source.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
