import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap
} from 'recharts';
import {
  TrendingUp,
  Award,
  Users,
  BookOpen,
  Building,
  Clock,
  Target,
  Activity,
  Download,
  Filter
} from 'lucide-react';

// Sample data based on R&B framework
const monthlyProgress = [
  { month: 'Jan', projects: 2, hours: 120, publications: 0 },
  { month: 'Feb', projects: 3, hours: 180, publications: 1 },
  { month: 'Mar', projects: 4, hours: 240, publications: 1 },
  { month: 'Apr', projects: 5, hours: 320, publications: 2 },
  { month: 'May', projects: 6, hours: 380, publications: 2 },
  { month: 'Jun', projects: 7, hours: 440, publications: 3 },
];

const categoryDistribution = [
  { name: 'Psychology', value: 4, color: '#9A3324' },
  { name: 'Sustainability', value: 3, color: '#B5BD00' },
  { name: 'Health & Safety', value: 3, color: '#67823A' },
  { name: 'Immersive Learning', value: 2, color: '#00A9E0' },
  { name: 'Campus Life', value: 2, color: '#9333EA' },
  { name: 'Fine Arts', value: 1, color: '#F2A900' },
];

const impactMetrics = [
  { category: 'Publications', score: 85, fullMark: 100 },
  { category: 'Citations', score: 72, fullMark: 100 },
  { category: 'Project Integration', score: 90, fullMark: 100 },
  { category: 'Partner Engagement', score: 78, fullMark: 100 },
  { category: 'Innovation', score: 88, fullMark: 100 },
  { category: 'Knowledge Transfer', score: 75, fullMark: 100 },
];

const researcherProductivity = [
  { name: 'Katherine Wiley', projects: 2, hours: 140, impact: 92 },
  { name: 'Leah van der Sanden', projects: 1, hours: 80, impact: 78 },
  { name: 'Monse Rios', projects: 2, hours: 120, impact: 85 },
  { name: 'Agustin Gonzalez', projects: 1, hours: 60, impact: 70 },
  { name: 'Brenda Swirczynski', projects: 1, hours: 40, impact: 75 },
];

const projectPhases = [
  { name: 'Pre-Research', value: 2, color: '#E0F2FE' },
  { name: 'Literature Review', value: 3, color: '#7DD3C0' },
  { name: 'Developmental', value: 4, color: '#60A5FA' },
  { name: 'Final Research', value: 2, color: '#818CF8' },
  { name: 'Publication', value: 1, color: '#C084FC' },
];

const Analytics: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');

  const stats = [
    {
      label: 'Total Research Hours',
      value: '1,480',
      change: '+240 this month',
      icon: Clock,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      label: 'Active Researchers',
      value: '12',
      change: '+3 new',
      icon: Users,
      color: 'from-purple-400 to-pink-500'
    },
    {
      label: 'Publications',
      value: '8',
      change: '3 pending',
      icon: BookOpen,
      color: 'from-green-400 to-emerald-500'
    },
    {
      label: 'Projects Influenced',
      value: '15',
      change: '+5 this quarter',
      icon: Building,
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Research Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Data-driven insights into research performance and impact
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Research Activity Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="#00A9E0"
                strokeWidth={2}
                dot={{ fill: '#00A9E0' }}
                name="Active Projects"
              />
              <Line
                type="monotone"
                dataKey="publications"
                stroke="#67823A"
                strokeWidth={2}
                dot={{ fill: '#67823A' }}
                name="Publications"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Research by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Impact Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Research Impact Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={impactMetrics}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis dataKey="category" stroke="#666" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
              <Radar
                name="Impact Score"
                dataKey="score"
                stroke="#00A9E0"
                fill="#00A9E0"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Researcher Productivity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">Researcher Productivity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={researcherProductivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="name" type="category" stroke="#666" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#00A9E0" name="Hours" />
              <Bar dataKey="impact" fill="#67823A" name="Impact Score" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Project Phases Treemap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Project Phase Distribution</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-research-sky text-white rounded-lg hover:bg-research-blue transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {projectPhases.map((phase, index) => (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div
                className="h-24 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: phase.color }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{phase.value}</p>
                  <p className="text-xs text-gray-600">{phase.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-research-sky via-research-blue to-research-purple text-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Activity className="w-8 h-8 mb-2" />
            <h3 className="font-semibold mb-1">Productivity Increase</h3>
            <p className="text-sm opacity-90">
              Research output has increased by 35% with AI assistance integration
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Award className="w-8 h-8 mb-2" />
            <h3 className="font-semibold mb-1">High Impact Score</h3>
            <p className="text-sm opacity-90">
              87% of completed research directly influenced architectural projects
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Users className="w-8 h-8 mb-2" />
            <h3 className="font-semibold mb-1">Growing Engagement</h3>
            <p className="text-sm opacity-90">
              12 active researchers with 3 new pitches submitted this month
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;