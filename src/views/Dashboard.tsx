import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  FileText,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Lightbulb,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { projects, loading } = useProjects();

  // Calculate category counts from actual data
  const researchCategories = useMemo(() => {
    const categoryCounts = projects.reduce((acc, project) => {
      const categoryName = project.category.replace('-', ' ').split(' ').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');

      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [projects]);

  // Get active projects (first 4)
  const activeProjects = useMemo(() =>
    projects.slice(0, 4).map(p => ({
      id: p.id,
      title: p.title,
      researcher: p.researcher,
      phase: p.phase,
      category: p.category
    })),
    [projects]
  );

  // Get unique researchers
  const uniqueResearchers = useMemo(() =>
    new Set(projects.map(p => p.researcher).filter(r => r !== 'TBD')),
    [projects]
  );
  const stats = [
    { label: 'Active Research', value: projects.length.toString(), icon: Activity, trend: '+2 this month' },
    { label: 'Researchers', value: uniqueResearchers.size.toString(), icon: Users, trend: '3 new pitches' },
    { label: 'Publications', value: '4', icon: FileText, trend: 'Texas Architect pending' },
    { label: 'Impact Score', value: '87', icon: Target, trend: '+12% YoY' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading research data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-dark-card border border-neon-red-500/20 p-8 neon-border"
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 text-white">
            Welcome to <span className="text-neon-red-500 neon-text">EZRA</span>
          </h1>
          <p className="text-xl text-gray-300">Transforming architectural research into built reality</p>
          <p className="mt-4 text-gray-400 italic border-l-2 border-neon-red-500/50 pl-4">
            "The application of architectural research into built works assisted by computational intelligence"
          </p>
        </div>
        <Sparkles className="absolute right-8 top-8 w-24 h-24 text-neon-red-500/10" />
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
              className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-neon-red-500/30 transition-all group"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1 text-white">{stat.value}</p>
                  <p className="text-xs text-neon-red-500 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </p>
                </div>
                <div className="p-3 bg-neon-red-500/10 border border-neon-red-500/20 rounded-lg group-hover:bg-neon-red-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-neon-red-500" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-card border border-dark-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Active Research Projects</h2>
              <button
                onClick={() => onNavigate('portfolio')}
                className="text-sm text-neon-red-500 hover:text-neon-red-400 transition-colors flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {activeProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-neon-red-500/30 transition-all cursor-pointer group"
                  onClick={() => onNavigate('portfolio')}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-gray-500">{project.id}</span>
                        <span className="px-2 py-1 text-xs rounded bg-neon-red-500/10 text-neon-red-500 border border-neon-red-500/20">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-neon-red-500 transition-colors">{project.title}</h3>
                      <p className="text-sm text-gray-400">{project.researcher}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 uppercase">Phase</span>
                      <p className="text-sm font-medium text-gray-300">{project.phase}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Research Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Research Categories</h2>
          <div className="space-y-2">
            {researchCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-bg border border-transparent hover:border-neon-red-500/20 transition-all cursor-pointer group"
                onClick={() => onNavigate('map')}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon-red-500" />
                  <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{category.name}</span>
                </div>
                <span className="text-sm text-gray-500">{category.count}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Call to Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative bg-dark-card border border-neon-red-500/30 p-6 rounded-xl cursor-pointer group overflow-hidden"
          onClick={() => onNavigate('pitch')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Lightbulb className="w-8 h-8 mb-3 text-neon-red-500 relative z-10" />
          <h3 className="text-lg font-bold mb-1 text-white relative z-10">Submit a Pitch</h3>
          <p className="text-sm text-gray-400 relative z-10">Have a research idea? Start here</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative bg-dark-card border border-neon-red-500/30 p-6 rounded-xl cursor-pointer group overflow-hidden"
          onClick={() => onNavigate('map')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Calendar className="w-8 h-8 mb-3 text-neon-red-500 relative z-10" />
          <h3 className="text-lg font-bold mb-1 text-white relative z-10">Explore Campus</h3>
          <p className="text-sm text-gray-400 relative z-10">Interactive research landscape</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative bg-dark-card border border-neon-red-500/30 p-6 rounded-xl cursor-pointer group overflow-hidden"
          onClick={() => onNavigate('analytics')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Award className="w-8 h-8 mb-3 text-neon-red-500 relative z-10" />
          <h3 className="text-lg font-bold mb-1 text-white relative z-10">View Impact</h3>
          <p className="text-sm text-gray-400 relative z-10">Metrics & achievements</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;