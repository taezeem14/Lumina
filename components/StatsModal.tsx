import React from 'react';
import { X } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { SystemStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SystemStats;
}

// Dummy data for charts
const loadData = [
  { name: '10s', value: 20 },
  { name: '20s', value: 45 },
  { name: '30s', value: 30 },
  { name: '40s', value: 60 },
  { name: '50s', value: 80 },
  { name: '60s', value: 55 },
];

const requestData = [
    { name: 'Mon', req: 1200 },
    { name: 'Tue', req: 2100 },
    { name: 'Wed', req: 1800 },
    { name: 'Thu', req: 2400 },
    { name: 'Fri', req: 3100 },
    { name: 'Sat', req: 4200 },
    { name: 'Sun', req: 3800 },
];

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-dark-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Analytics</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time AI processing metrics</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8">
            
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-primary-50 dark:bg-dark-800 p-4 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">GPU Load</p>
                <p className="text-2xl font-bold text-primary-600">{stats.gpuLoad}%</p>
             </div>
             <div className="bg-purple-50 dark:bg-dark-800 p-4 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Memory</p>
                <p className="text-2xl font-bold text-purple-600">{stats.memoryUsage}GB</p>
             </div>
             <div className="bg-green-50 dark:bg-dark-800 p-4 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Latency</p>
                <p className="text-2xl font-bold text-green-600">{stats.latency}ms</p>
             </div>
             <div className="bg-orange-50 dark:bg-dark-800 p-4 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Requests</p>
                <p className="text-2xl font-bold text-orange-600">{stats.requests}</p>
             </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold mb-4 dark:text-white">Processing Load</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={loadData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            />
                            <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold mb-4 dark:text-white">Weekly Requests</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={requestData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} 
                            />
                            <Line type="monotone" dataKey="req" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6'}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatsModal;