import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Download,
  ExternalLink,
  Calendar,
  Users,
  BookOpen,
  Award,
  Filter,
  Grid,
  List,
  ChevronRight,
  Building2,
  Lightbulb,
  Target
} from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';

interface ResearchProject {
  id: string;
  title: string;
  researcher: string;
  category: string;
  phase: string;
  completionDate?: string;
  description: string;
  image: string;
  deliverables: string[];
  impact: {
    publications: number;
    citations: number;
    projects: string[];
  };
  partners: string[];
}

const portfolioProjects: ResearchProject[] = [
  {
    id: 'X24-RB01',
    title: 'Biophilic Learning Environments',
    researcher: 'Sarah Chen',
    category: 'sustainability',
    phase: 'Completed',
    completionDate: '2024-03',
    description: 'Investigating the impact of nature-integrated design on student cognitive performance and wellbeing in K-12 settings.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    deliverables: ['Research Report', 'Design Guidelines', 'Case Studies'],
    impact: {
      publications: 2,
      citations: 15,
      projects: ['Westlake Elementary', 'Riverside Middle School']
    },
    partners: ['UT Austin', 'Green Building Council']
  },
  {
    id: 'X24-RB02',
    title: 'Flexible Learning Spaces',
    researcher: 'Michael Rodriguez',
    category: 'immersive',
    phase: 'Completed',
    completionDate: '2024-06',
    description: 'Exploring adaptable classroom configurations that support multiple pedagogical approaches and learning styles.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    deliverables: ['Whitepaper', 'Video Documentation', 'Toolkit'],
    impact: {
      publications: 1,
      citations: 8,
      projects: ['Innovation High School']
    },
    partners: ['A4LE', 'Education Design Lab']
  },
  {
    id: 'X24-RB03',
    title: 'Acoustic Design for Focus',
    researcher: 'Emily Watson',
    category: 'health-safety',
    phase: 'Completed',
    completionDate: '2024-08',
    description: 'Analyzing acoustic treatments and their effect on student concentration and teacher vocal health.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    deliverables: ['Technical Report', 'Specification Guide'],
    impact: {
      publications: 1,
      citations: 12,
      projects: ['Central Library Renovation', 'Tech Center']
    },
    partners: ['Acoustical Society']
  }
];

const Portfolio: React.FC = () => {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter for completed projects only
  const completedProjects = useMemo(() =>
    projects.filter(p => p.phase === 'Completed'),
    [projects]
  );

  const categories = [
    { id: 'all', label: 'All Research', color: 'from-gray-400 to-gray-600' },
    { id: 'sustainability', label: 'Sustainability', color: 'from-lime-400 to-green-500' },
    { id: 'immersive', label: 'Immersive Learning', color: 'from-blue-400 to-cyan-500' },
    { id: 'health-safety', label: 'Health & Safety', color: 'from-green-400 to-green-600' },
    { id: 'psychology', label: 'Psychology', color: 'from-red-400 to-red-600' },
    { id: 'fine-arts', label: 'Fine Arts', color: 'from-purple-400 to-pink-500' },
    { id: 'campus-life', label: 'Campus Life', color: 'from-blue-400 to-indigo-500' },
  ];

  const filteredProjects = completedProjects.filter(
    project => filterCategory === 'all' || project.category === filterCategory
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading completed research...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2 text-white">Research Portfolio</h1>
        <p className="text-gray-400">
          Explore completed research and its impact on built environments
        </p>
      </motion.div>

      {/* Filters and View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  filterCategory === cat.id
                    ? 'bg-gradient-to-r text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 hover:shadow-md'
                }`}
                style={{
                  backgroundImage: filterCategory === cat.id ? `linear-gradient(to right, var(--tw-gradient-stops))` : '',
                  '--tw-gradient-from': cat.color.split(' ')[0].replace('from-', ''),
                  '--tw-gradient-to': cat.color.split(' ')[1].replace('to-', ''),
                } as React.CSSProperties}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-research-sky text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-research-sky text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Projects Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg">{project.title}</h3>
                    <p className="text-white/80 text-sm">{project.researcher}</p>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Project Info */}
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-neon-red-400" />
                      <span>{project.partners?.length || 0} partners</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{project.completionDate}</span>
                    </div>
                  </div>

                  {/* View More */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      <Calendar className="inline w-3 h-3 mr-1" />
                      {project.completionDate}
                    </span>
                    <span className="text-research-sky text-sm font-medium group-hover:text-research-blue transition-colors">
                      View Details
                      <ChevronRight className="inline w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start gap-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {project.researcher} • {project.completionDate}
                        </p>
                      </div>
                      <Eye className="w-5 h-5 text-research-sky" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-neon-red-400" />
                        {project.partners?.length || 0} partners
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Completed {project.completionDate}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h2>
                  <p className="text-white/80">
                    {selectedProject.researcher} • {selectedProject.completionDate}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Research Overview</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Deliverables */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Deliverables</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.deliverables.map(deliverable => (
                      <button
                        key={deliverable}
                        className="px-4 py-2 bg-research-sky/10 text-research-sky rounded-lg hover:bg-research-sky/20 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {deliverable}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="bg-gradient-to-br from-neon-red-500/10 to-neon-red-600/10 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-5 h-5 text-neon-red-500" />
                      <div>
                        <p className="text-xs text-gray-500">Completed</p>
                        <p className="font-semibold">{selectedProject.completionDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-5 h-5 text-neon-red-400" />
                      <div>
                        <p className="text-xs text-gray-500">Partners</p>
                        <p className="font-semibold">{selectedProject.partners?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Research Partners */}
                {selectedProject.partners && selectedProject.partners.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Research Partners</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.partners.map((partner: string) => (
                        <span
                          key={partner}
                          className="px-3 py-1 bg-neon-red-500/10 border border-neon-red-500/20 text-neon-red-500 rounded-full text-sm"
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Partners */}
                {selectedProject.partners.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Research Partners</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.partners.map(partner => (
                        <span
                          key={partner}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                        >
                          <Users className="inline w-3 h-3 mr-1" />
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;