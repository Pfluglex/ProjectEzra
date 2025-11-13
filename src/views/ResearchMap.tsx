import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, X, Calendar } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { useProjects } from '../context/ProjectsContext';
import type { ResearchProject } from '../data/loadProjects';
import { useTheme } from '../components/System/ThemeManager';
import { MAPBOX_TOKEN } from '../config/mapbox';

mapboxgl.accessToken = MAPBOX_TOKEN;

const ResearchMap: React.FC = () => {
  const { projects: researchProjects, loading } = useProjects();
  const { researchColors, componentThemes } = useTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const initialized = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);

  // Extract category colors from theme
  const categoryColors = Object.entries(researchColors).reduce((acc, [key, value]) => {
    acc[key] = value.color;
    return acc;
  }, {} as Record<string, string>);

  useEffect(() => {
    if (!mapContainer.current || initialized.current || loading) return;

    initialized.current = true;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-97.7431, 30.2672],
      zoom: 5,
      pitch: 30,
      bearing: 0,
      projection: 'mercator',
      antialias: true
    });

    map.current.on('style.load', () => {
      if (!map.current) return;
      map.current.setConfigProperty('basemap', 'lightPreset', 'night');

      // Hide POI labels and road labels
      try {
        map.current.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
        map.current.setConfigProperty('basemap', 'showRoadLabels', false);
      } catch (e) {
        // Config not available
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      initialized.current = false;
    };
  }, [loading]);

  // Add markers when projects load
  useEffect(() => {
    if (!map.current || researchProjects.length === 0) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    researchProjects.forEach((project) => {
      const isConfidential = ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(project.id);
      const baseColor = categoryColors[project.category] || componentThemes.map.dark.confidentialColor;
      const color = isConfidential ? '#666666' : baseColor;

      const marker = new mapboxgl.Marker({
        color: color,
        scale: 1
      })
        .setLngLat([project.position[1], project.position[0]])
        .addTo(map.current!);

      const popup = new mapboxgl.Popup({
        closeButton: false,
        className: 'research-popup'
      }).setHTML(`
        <div style="text-align: center; padding: 4px;">
          <strong style="color: ${color};">
            ${isConfidential ? '🔒 CONFIDENTIAL' : project.title}
          </strong><br/>
          <span style="font-size: 11px; color: #999;">${project.id}</span>
        </div>
      `);

      marker.setPopup(popup);

      marker.getElement().addEventListener('click', () => {
        setSelectedProject(project);
        map.current?.flyTo({
          center: [project.position[1], project.position[0]],
          zoom: 11,
          pitch: 45,
          duration: 2000
        });
      });

      markers.current.push(marker);
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [researchProjects, categoryColors, componentThemes]);

  const filteredProjects = researchProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.researcher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative h-[calc(100vh-6rem)] rounded-xl overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 z-0" />

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-0 left-0 bottom-0 z-10 bg-dark-card/95 backdrop-blur-xl border-r border-neon-red-500/20 shadow-2xl w-80 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-neon-red-500/20">
          <h2 className="text-lg font-bold text-white">Research Campus</h2>
          <p className="text-xs text-gray-500 mt-1">3D Interactive Map</p>
        </div>

        {/* Search and Filter */}
        <div className="p-4 space-y-4 border-b border-neon-red-500/20">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-dark-border bg-dark-bg text-white placeholder:text-gray-500 focus:border-neon-red-500/50 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1 block uppercase tracking-wide">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-dark-border bg-dark-bg text-white focus:border-neon-red-500/50 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="psychology">Psychology</option>
              <option value="health-safety">Health & Safety</option>
              <option value="sustainability">Sustainability</option>
              <option value="immersive">Immersive Learning</option>
              <option value="campus-life">Campus Life</option>
              <option value="fine-arts">Fine Arts</option>
            </select>
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-dark-border/30">
            {filteredProjects.map(project => {
              const isConfidential = ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(project.id);
              const markerColor = isConfidential ? '#666666' : categoryColors[project.category];
              return (
                <motion.div
                  key={project.id}
                  whileHover={{ backgroundColor: 'rgba(255, 59, 74, 0.05)' }}
                  className="px-4 py-3 cursor-pointer transition-all group"
                  onClick={() => {
                    setSelectedProject(project);
                    map.current?.flyTo({
                      center: [project.position[1], project.position[0]],
                      zoom: 11,
                      pitch: 45,
                      duration: 2000
                    });
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isConfidential && (
                        <span className="text-xs text-gray-500 mb-1 block">🔒 CONFIDENTIAL</span>
                      )}
                      <h3 className={`font-semibold text-sm group-hover:text-neon-red-500 transition-colors ${
                        isConfidential ? 'text-gray-400' : 'text-white'
                      }`}>
                        {project.title}
                      </h3>
                      <p className="text-xs text-gray-500">{project.researcher}</p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{
                        backgroundColor: markerColor,
                        boxShadow: 'inset 0 -1px 2px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="border-t border-neon-red-500/20 p-4 bg-dark-card/95">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-white">
            <Layers className="w-4 h-4 text-neon-red-500" />
            Map Legend
          </h3>
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Categories</p>
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2 text-xs text-gray-400">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="capitalize">{category.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Project Detail Panel */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`absolute left-0 top-0 bottom-0 z-20 w-96 bg-dark-card/95 backdrop-blur-xl shadow-2xl overflow-y-auto ${
              ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(selectedProject.id)
                ? 'border-r-2 border-gray-600/50'
                : 'border-r border-neon-red-500/20'
            }`}
          >
            {/* Header */}
            <div className={`sticky top-0 bg-dark-card/95 backdrop-blur-xl p-4 flex items-start justify-between ${
              ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(selectedProject.id)
                ? 'border-b-2 border-gray-600/50'
                : 'border-b border-neon-red-500/20'
            }`}>
              <div className="flex-1">
                {['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(selectedProject.id) && (
                  <div className="flex items-center gap-2 mb-2 text-gray-400">
                    <span className="text-xs uppercase tracking-wider">🔒 Confidential</span>
                  </div>
                )}
                <h2 className={`text-xl font-bold mb-1 ${
                  ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(selectedProject.id)
                    ? 'text-gray-400'
                    : 'text-white'
                }`}>{selectedProject.title}</h2>
                <p className="text-sm text-gray-500">{selectedProject.id}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-neon-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Researcher */}
              <div>
                <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Researcher</h3>
                <p className="text-white font-medium">{selectedProject.researcher}</p>
              </div>

              {/* Phase */}
              <div>
                <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Phase</h3>
                <span className="inline-block px-3 py-1 bg-neon-red-500/10 border border-neon-red-500/20 rounded-full text-sm text-neon-red-500">
                  {selectedProject.phase}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Description</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Timeline */}
              {(selectedProject.startDate || selectedProject.completionDate) && (
                <div>
                  <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3">Timeline</h3>
                  <div className="space-y-2">
                    {selectedProject.startDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-neon-red-500" />
                        <span className="text-gray-400">Started:</span>
                        <span className="text-white">{selectedProject.startDate}</span>
                      </div>
                    )}
                    {selectedProject.completionDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-neon-red-400" />
                        <span className="text-gray-400">Completed:</span>
                        <span className="text-white">{selectedProject.completionDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Partners */}
              {selectedProject.partners && selectedProject.partners.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3">Research Partners</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.partners.map(partner => (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResearchMap;
