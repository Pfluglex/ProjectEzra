import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  PenTool,
  Grid3x3,
  BarChart3,
  Home,
  Sparkles,
  Building2,
  Network,
  LogIn,
  LogOut,
  Mail
} from 'lucide-react';
import './index.css';

// Import theme and auth providers
import { ThemeProvider } from './components/System/ThemeManager';
import { AuthProvider, useAuth } from './components/System/AuthContext';
import { LoginModal } from './components/System/LoginModal';

// Import views
import Dashboard from './views/Dashboard';
import ResearchMap from './views/ResearchMap';
import PitchSubmission from './views/PitchSubmission';
import Portfolio from './views/Portfolio';
import Analytics from './views/Analytics';
import Collaborate from './views/Collaborate';

type ViewType = 'dashboard' | 'map' | 'pitch' | 'portfolio' | 'analytics' | 'collaborate';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  requiresAuth?: boolean; // Internal-only views
  hideWhenAuth?: boolean; // Public-only views (like Collaborate)
}

// Public views (always visible)
const publicNavigation: NavItem[] = [
  {
    id: 'map',
    label: 'Research Campus',
    icon: Map,
    color: 'bg-gradient-to-br from-research-purple to-research-sky',
    description: 'Interactive map of research projects'
  },
  {
    id: 'portfolio',
    label: 'Gallery',
    icon: Grid3x3,
    color: 'bg-gradient-to-br from-research-olive to-research-lime',
    description: 'Explore completed research'
  },
  {
    id: 'collaborate',
    label: 'Collaborate',
    icon: Mail,
    color: 'bg-gradient-to-br from-research-sky to-research-blue',
    description: 'Partner with us',
    hideWhenAuth: true // Hide when logged in
  }
];

// Internal views (only visible when logged in)
const internalNavigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Research Hub',
    icon: Home,
    color: 'bg-gradient-to-br from-research-sky to-research-blue',
    description: 'Overview of all research activities',
    requiresAuth: true
  },
  {
    id: 'pitch',
    label: 'Submit Pitch',
    icon: PenTool,
    color: 'bg-gradient-to-br from-research-orange to-research-lime',
    description: 'Propose new research ideas',
    requiresAuth: true
  },
  {
    id: 'analytics',
    label: 'Insights',
    icon: BarChart3,
    color: 'bg-gradient-to-br from-pfluger-brick to-research-orange',
    description: 'Research metrics & impact',
    requiresAuth: true
  }
];

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('map');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Get navigation based on auth state
  const visibleNavigation = [
    ...publicNavigation.filter(item => !item.hideWhenAuth || !isAuthenticated),
    ...(isAuthenticated ? internalNavigation : [])
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveView} />;
      case 'map':
        return <ResearchMap />;
      case 'pitch':
        return <PitchSubmission />;
      case 'portfolio':
        return <Portfolio />;
      case 'analytics':
        return <Analytics />;
      case 'collaborate':
        return <Collaborate />;
      default:
        return <ResearchMap />;
    }
  };

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <div className="relative min-h-screen bg-dark-bg overflow-hidden">
      {/* Animated background elements with neon red */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full bg-neon-red-500/5 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div
          className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-neon-red-600/5 blur-3xl"
          style={{
            transform: `translate(-${mousePosition.x * 0.03}px, -${mousePosition.y * 0.03}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 59, 74, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 59, 74, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Full Height Left Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 bottom-0 z-50 bg-dark-card/80 backdrop-blur-xl border-r border-neon-red-500/20 shadow-2xl flex flex-col neon-border"
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo at Top */}
        <div className="p-4 border-b border-neon-red-500/20">
          <motion.div
            className="flex items-center gap-3"
            animate={{ scale: isSidebarExpanded ? 1 : 1 }}
          >
            <div className="relative">
              <Building2 className="w-8 h-8 text-neon-red-500 glow-effect" />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-neon-red-400 animate-pulse" />
            </div>
            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-lg font-bold text-neon-red-500 neon-text whitespace-nowrap">
                    EZRA
                  </h1>
                  <p className="text-xs text-gray-400 whitespace-nowrap">Research Platform</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation Items - Flex Grow to take available space */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {visibleNavigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`
                  relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 mb-2
                  ${isActive
                    ? 'bg-neon-red-500/10 border border-neon-red-500/30'
                    : 'hover:bg-white/5 border border-transparent hover:border-neon-red-500/10'
                  }
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-neon-red-500 rounded-r"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`p-2 rounded-lg ${isActive ? 'bg-neon-red-500/20' : 'bg-white/5'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-neon-red-500' : 'text-gray-400'}`} />
                </div>

                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden"
                    >
                      <span className={`font-medium whitespace-nowrap ${isActive ? 'text-neon-red-500' : 'text-gray-300'}`}>
                        {item.label}
                      </span>
                      <p className="text-xs text-gray-500 whitespace-nowrap">{item.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Sign In / Sign Out at Bottom */}
        <div className="p-4 border-t border-neon-red-500/20">
          {isAuthenticated ? (
            <motion.button
              onClick={logout}
              className="flex items-center gap-2 w-full p-2 hover:bg-white/5 rounded-lg transition-colors"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 rounded-lg bg-neon-red-500/20">
                <LogOut className="w-5 h-5 text-neon-red-500" />
              </div>
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm text-gray-300 whitespace-nowrap overflow-hidden"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 w-full p-2 hover:bg-white/5 rounded-lg transition-colors"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 rounded-lg bg-neon-red-500/20">
                <LogIn className="w-5 h-5 text-neon-red-500" />
              </div>
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm text-gray-300 whitespace-nowrap overflow-hidden"
                  >
                    Team Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="pl-24 pr-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;