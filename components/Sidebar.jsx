import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FilePlus, 
  GitBranch, 
  History, 
  MessageSquareShare, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  
  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      shortLabel: 'Overview',
      icon: LayoutDashboard,
      description: 'Grievance statistics & summaries'
    },
    {
      id: 'file',
      label: 'File a new complaint',
      shortLabel: 'File New',
      icon: FilePlus,
      description: 'Submit a new student complaint'
    },
    {
      id: 'track',
      label: 'Track your complaint status',
      shortLabel: 'Track Status',
      icon: GitBranch,
      description: 'Real-time updates timeline'
    },
    {
      id: 'history',
      label: 'History of your complaint',
      shortLabel: 'History',
      icon: History,
      description: 'Browse all past submissions'
    },
    {
      id: 'feed',
      label: 'Community Feed',
      shortLabel: 'Community',
      icon: MessageSquareShare,
      description: 'Public complaints & discussions'
    },
  ];

  return (
    <motion.aside
      id="portal-sidebar"
      initial={{ width: isCollapsed ? 76 : 280 }}
      animate={{ width: isCollapsed ? 76 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-border dark:border-border-dark bg-surface dark:bg-surface-dark transition-colors duration-200 overflow-hidden"
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-border dark:border-border-dark ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col whitespace-nowrap"
            >
              <span className="font-heading font-bold text-sm tracking-tight">
                <span className="text-text-primary dark:text-text-primary-dark">Grievance</span>
                <span className="text-primary dark:text-secondary-dark">Flow</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-primary uppercase">
                Student Hub
              </span>
            </motion.div>
          </div>
        )}
        
        {/* Toggle Expand/Collapse Icon — the only thing visible when collapsed */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center h-8 w-8 rounded-lg border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors cursor-pointer shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-text-primary-dark font-semibold' 
                  : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:bg-bg dark:hover:bg-bg-dark'
              }`}
            >
              {/* Highlight background bar — only rendered when expanded so it can't
                  peek out as a stray colored sliver while the sidebar is collapsed */}
              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="activeBar"
                  className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r bg-primary dark:bg-secondary"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              
              <IconComponent className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-primary dark:text-secondary-dark' : 'text-text-secondary dark:text-text-secondary-dark'
              }`} />
              
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col overflow-hidden"
                >
                  <span className="text-xs font-semibold whitespace-nowrap block truncate">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-text-secondary/70 dark:text-text-secondary-dark/60 block truncate font-normal leading-tight">
                    {item.description}
                  </span>
                </motion.div>
              )}

              {isCollapsed && (
                /* Hover Tooltip when sidebar is collapsed */
                <div className="absolute left-16 scale-0 group-hover:scale-100 bg-text-primary dark:bg-white text-white dark:text-bg-dark text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap pointer-events-none transition-transform duration-200 origin-left shadow-xl border border-white/15 z-50">
                  {item.shortLabel}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status Card */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border dark:border-border-dark">
          <div className="p-3 bg-bg dark:bg-bg-dark/50 rounded-xl text-center border border-border dark:border-border-dark">
            <p className="text-[10px] font-semibold text-text-primary dark:text-text-primary-dark uppercase tracking-wider">
              Centralized Portal
            </p>
            <p className="text-[9px] text-text-secondary/80 dark:text-text-secondary-dark/60 mt-0.5">
              Secure Frontend Layer
            </p>
          </div>
        </div>
      )}
    </motion.aside>
  );
}