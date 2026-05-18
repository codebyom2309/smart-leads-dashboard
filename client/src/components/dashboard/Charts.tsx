import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { LeadStats } from '../../types';
import { STATUS_CHART_COLORS, SOURCE_CHART_COLORS } from '../../constants';
import { motion } from 'framer-motion';

interface ChartsProps {
  stats: LeadStats;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps): JSX.Element | null => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-dark-card border border-hairline dark:border-dark-border rounded-xl shadow-modal p-3">
      {label && <p className="text-xs text-mute mb-1.5">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
          <span className="text-xs font-medium text-ink dark:text-white">
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const StatusChart = ({ stats }: ChartsProps): JSX.Element => {
  const data = Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }));

  const filteredData = data.filter((d) => d.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="card p-5"
    >
      <h3 className="text-sm font-semibold text-ink dark:text-white mb-1 tracking-tight">
        Leads by Status
      </h3>
      <p className="text-xs text-mute dark:text-gray-500 mb-4">Distribution across pipeline stages</p>

      {filteredData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-mute text-sm">
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {filteredData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_CHART_COLORS[entry.name as keyof typeof STATUS_CHART_COLORS]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-body dark:text-gray-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export const SourceChart = ({ stats }: ChartsProps): JSX.Element => {
  const data = Object.entries(stats.bySource).map(([name, value]) => ({ name, value }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="card p-5"
    >
      <h3 className="text-sm font-semibold text-ink dark:text-white mb-1 tracking-tight">
        Leads by Source
      </h3>
      <p className="text-xs text-mute dark:text-gray-500 mb-4">Where your leads are coming from</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
          <Bar dataKey="value" name="Leads" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={SOURCE_CHART_COLORS[entry.name as keyof typeof SOURCE_CHART_COLORS]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
