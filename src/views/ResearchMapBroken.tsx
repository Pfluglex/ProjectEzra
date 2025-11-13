import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Layers, Calendar } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { useProjects } from '../context/ProjectsContext';
import type { ResearchProject } from '../data/loadProjects';
import { useTheme } from '../components/System/ThemeManager';
import { MAPBOX_TOKEN, MAPBOX_STYLES, MAP_CONFIG } from '../config/mapbox';

// Set Mapbox access token
mapboxgl.accessToken = MAPBOX_TOKEN;

const ResearchMap: React.FC = () => {
  const { projects: researchProjects, loading } = useProjects();
  const { getPhaseColor, componentThemes, researchColors } = useTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract category colors from theme
  const categoryColors = Object.entries(researchColors).reduce((acc, [key, value]) => {
    acc[key] = value.color;
    return acc;
  }, {} as Record<string, string>);


  // Create custom marker element
  const createMarkerElement = (category: string, phase: string, projectId: string) => {
    const isConfidential = ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(projectId);
    const baseColor = categoryColors[category] || componentThemes.map.dark.confidentialColor;
    const color = isConfidential ? componentThemes.map.dark.confidentialColor : baseColor;
    const size = componentThemes.map.dark.markerSize;

    // Get icon based on category
    const getIconSvg = (cat: string) => {
      if (isConfidential) {
        return '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';
      }

      const iconMap: Record<string, string> = {
        'psychology': '<path d="M12 2a10 10 0 0 1 10 10c0 5.25-4.47 9.17-7.47 11.66-.39.32-.86.48-1.33.48s-.94-.16-1.33-.48C8.87 21.17 4.4 17.25 4.4 12A10 10 0 0 1 12 2z"/><circle cx="12" cy="10" r="3"/>',
        'health-safety': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
        'sustainability': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
        'immersive': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/>',
        'campus-life': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
        'fine-arts': '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>'
      };
      return iconMap[cat] || '<circle cx="12" cy="12" r="10"/>';
    };

    // Create simple div element
    const el = document.createElement('div');
    el.className = 'custom-research-marker';
    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${isConfidential ? 'linear-gradient(135deg, #666666, #333333)' : color};
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.1);
      border: ${isConfidential ? '3px dashed rgba(255, 255, 255, 0.3)' : '3px solid rgba(17, 17, 17, 0.9)'};
      transition: transform 0.2s ease;
      ${isConfidential ? 'opacity: 0.7;' : ''}
    `;

    el.innerHTML = `
      <svg
        width="${size * 0.5}"
        height="${size * 0.5}"
        viewBox="0 0 24 24"
        fill="none"
        stroke="${isConfidential ? '#cccccc' : 'white'}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        ${getIconSvg(category)}
      </svg>
    `;

    return el;
  };

  useEffect(() => {
    if (!mapContainer.current || loading || researchProjects.length === 0 || map.current) return;

    // Initialize map with 3D capabilities
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLES.standardNight,
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.zoom,
      pitch: MAP_CONFIG.pitch, // 3D perspective
      bearing: MAP_CONFIG.bearing,
      antialias: true // Smooth 3D rendering
    });

    // Set theme to night mode
    map.current.on('style.load', () => {
      if (!map.current) return;
      map.current.setConfigProperty('basemap', 'lightPreset', 'night');
    });

    // Add navigation controls (zoom, rotation, pitch)
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true
      }),
      'top-right'
    );

    // Standard Night style already has 3D buildings built-in!

    // Add markers for research projects
    researchProjects.forEach((project) => {
      const isConfidential = ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(project.id);
      const baseColor = categoryColors[project.category] || componentThemes.map.dark.confidentialColor;
      const color = isConfidential ? '#666666' : baseColor;

      // Get icon SVG path based on category
      const getIconSvg = (cat: string) => {
        if (isConfidential) {
          return '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';
        }

        const iconMap: Record<string, string> = {
          'psychology': '<circle cx="12" cy="12" r="3"/>',
          'health-safety': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
          'sustainability': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>',
          'immersive': '<rect width="14" height="14" x="5" y="5" rx="2"/>',
          'campus-life': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
          'fine-arts': '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>'
        };
        return iconMap[cat] || '<circle cx="12" cy="12" r="3"/>';
      };

      // Use default Mapbox marker with custom color
      const marker = new mapboxgl.Marker({
        color: color,
        scale: 1
      })
        .setLngLat([project.position[1], project.position[0]])
        .addTo(map.current!);

      // Inject custom icon into the marker
      const markerElement = marker.getElement();
      const svg = markerElement.querySelector('svg');
      if (svg) {
        // Add icon in the center of the marker
        const iconGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        iconGroup.setAttribute('transform', 'translate(14, 16) scale(0.5)');
        iconGroup.innerHTML = `
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            ${getIconSvg(project.category)}
          </svg>
        `;
        svg.appendChild(iconGroup);
      }

      // Add popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        className: 'research-popup'
      }).setHTML(`
        <div style="text-align: center; padding: 4px;">
          <strong style="color: ${isConfidential ? '#666666' : categoryColors[project.category]};">
            ${isConfidential ? '🔒 CONFIDENTIAL' : project.title}
          </strong><br/>
          <span style="font-size: 11px; color: #999;">${project.id}</span>
        </div>
      `);

      marker.setPopup(popup);

      // Click handler on marker element
      markerElement.addEventListener('click', () => {
        setSelectedProject(project);
        map.current?.flyTo({
          center: [project.position[1], project.position[0]],
          zoom: 11,
          pitch: 45,
          bearing: 0,
          duration: 2000
        });
      });

      markers.current.push(marker);
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [loading, researchProjects]);

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

      {/* Search and Filter Panel - Full Height */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-0 left-0 bottom-0 z-10 bg-dark-card/95 backdrop-blur-xl border-r border-neon-red-500/20 shadow-2xl w-80 flex flex-col"
      >
        {/* Fixed Header */}
        <div className="p-4 border-b border-neon-red-500/20">
          <h2 className="text-lg font-bold text-white">Research Campus</h2>
          <p className="text-xs text-gray-500 mt-1">3D Interactive Map</p>
        </div>

        {/* Fixed Search and Filter */}
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

        {/* Scrollable Project List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-dark-border/30">
            {filteredProjects.map(project => {
              const isConfidential = ['X25-RB09', 'X25-RB10', 'X25-RB11'].includes(project.id);
              const baseColor = categoryColors[project.category] || componentThemes.map.dark.confidentialColor;
              const markerColor = isConfidential ? componentThemes.map.dark.confidentialColor : baseColor;
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
                      bearing: 0,
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

        {/* Legend at Bottom */}
        <div className="border-t border-neon-red-500/20 p-4 bg-dark-card/95">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-white">
            <Layers className="w-4 h-4 text-neon-red-500" />
            Map Legend
          </h3>

          {/* Category Icons */}
          <div className="space-y-2 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Categories</p>
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2 text-xs text-gray-400">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    {category === 'psychology' && <><path d="M12 2a10 10 0 0 1 10 10c0 5.25-4.47 9.17-7.47 11.66-.39.32-.86.48-1.33.48s-.94-.16-1.33-.48C8.87 21.17 4.4 17.25 4.4 12A10 10 0 0 1 12 2z"/><circle cx="12" cy="10" r="3"/></>}
                    {category === 'health-safety' && <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>}
                    {category === 'sustainability' && <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></>}
                    {category === 'immersive' && <><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></>}
                    {category === 'campus-life' && <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
                    {category === 'fine-arts' && <><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></>}
                  </svg>
                </div>
                <span className="capitalize">{category.replace('-', ' ')}</span>
              </div>
            ))}

            {/* Confidential */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border border-dashed border-gray-500"
                style={{ background: 'linear-gradient(135deg, #666666, #333333)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span>Confidential</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Left Sidebar Detail Panel */}
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span className="text-xs uppercase tracking-wider">Confidential</span>
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

      {/* Custom styles for Mapbox popups and markers */}
      <style>{`
        .mapboxgl-popup-content {
          background-color: #1e1e1e;
          border: 1px solid rgba(255, 59, 74, 0.2);
          border-radius: 8px;
          padding: 8px;
        }
        .mapboxgl-popup-tip {
          border-top-color: #1e1e1e;
        }
        .custom-research-marker {
          transition: filter 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        .custom-research-marker:hover {
          filter: brightness(1.2);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.2);
        }
        .mapboxgl-marker {
          pointer-events: auto;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default ResearchMap;
