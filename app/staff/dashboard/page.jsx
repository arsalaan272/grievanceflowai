'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import ThemeToggle from '@/components/ThemeToggle';
import {
  LogOut,
  ShieldCheck,
  Search,
  Menu,
  X,
  Inbox,
  AlertTriangle,
  ClipboardList,
  Clock3,
  Loader2,
  CheckCircle2,
  UserRound,
  CheckCheck,
} from 'lucide-react';

const STATUS_STYLES = {
  Pending: {
    topBorder: 'border-t-warning dark:border-t-warning-dark',
    pill: 'bg-warning/10 text-warning border-warning/30 dark:bg-warning-dark/10 dark:text-warning-dark dark:border-warning-dark/30',
    dot: 'bg-warning dark:bg-warning-dark',
  },
  'In Progress': {
    topBorder: 'border-t-secondary dark:border-t-secondary-dark',
    pill: 'bg-secondary/10 text-secondary border-secondary/30 dark:bg-secondary-dark/10 dark:text-secondary-dark dark:border-secondary-dark/30',
    dot: 'bg-secondary dark:bg-secondary-dark',
  },
  Resolved: {
    topBorder: 'border-t-success dark:border-t-success-dark',
    pill: 'bg-success/10 text-success border-success/30 dark:bg-success-dark/10 dark:text-success-dark dark:border-success-dark/30',
    dot: 'bg-success dark:bg-success-dark',
  },
};

const PRIORITY_STYLES = {
  High: 'bg-danger/10 text-danger dark:bg-danger-dark/10 dark:text-danger-dark',
  Medium: 'bg-warning/10 text-warning dark:bg-warning-dark/10 dark:text-warning-dark',
  Low: 'bg-success/10 text-success dark:bg-success-dark/10 dark:text-success-dark',
};

function StatCard({ label, value, icon: Icon, tone, index }) {
  const toneClasses = {
    primary: 'from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark',
    warning: 'from-warning to-warning/70 dark:from-warning-dark dark:to-warning-dark/70',
    secondary: 'from-secondary to-accent dark:from-secondary-dark dark:to-accent-dark',
    success: 'from-success to-success/70 dark:from-success-dark dark:to-success-dark/70',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${toneClasses[tone]} flex items-center justify-center text-white mb-3 shadow-md`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark leading-none font-heading">{value}</p>
      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1.5">{label}</p>
    </motion.div>
  );
}

export default function StaffDashboard() {
  const [tab, setTab] = useState('assigned');
  const [grievances, setGrievances] = useState([]);
  const [staffInfo, setStaffInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Filter / search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const info = localStorage.getItem('staffInfo');
    if (!info) {
      router.push('/staff/login');
      return;
    }
    setStaffInfo(JSON.parse(info));
  }, [router]);

  useEffect(() => {
    if (staffInfo) fetchGrievances();
  }, [tab, staffInfo]);

  // Lock body scroll while the mobile sidebar is open full-screen
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Only the HOD can change a complaint's status. Everyone else (wardens,
  // lecturers, etc.) can view assigned/escalated complaints but the status
  // control is read-only for them.
  const isHOD = staffInfo?.role === 'HOD';

  const fetchGrievances = async () => {
    setError('');
    setLoading(true);
    const token = localStorage.getItem('staffToken');
    const endpoint = tab === 'assigned' ? 'assigned' : tab === 'escalated' ? 'escalated' : 'resolved';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grievances/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Could not load complaints.');
        setGrievances([]);
      } else {
        setGrievances(data);
      }
    } catch (err) {
      setError('Could not reach the server. Check it is running.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!isHOD) return; // safety net — only HOD may update status
    const token = localStorage.getItem('staffToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grievances/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Could not update status.');
        return;
      }

      setGrievances((prev) =>
        prev.map((g) => (g._id === id ? { ...g, status: data.status } : g))
      );

      fetchGrievances();
    } catch (err) {
      setError('Could not reach the server. Check it is running.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffInfo');
    router.push('/staff/login');
  };

  const selectTab = (value) => {
    setTab(value);
    setSidebarOpen(false); // collapse the full-screen menu once a section is picked on mobile
  };

  // Distinct categories present in the current data set, for the filter dropdown
  const categoryOptions = useMemo(() => {
    const set = new Set(grievances.map((g) => g.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [grievances]);

  const priorityOptions = useMemo(() => {
    const set = new Set(grievances.map((g) => g.priority).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [grievances]);

  const filteredGrievances = useMemo(() => {
    return grievances
      .filter((item) => {
        const q = searchQuery.toLowerCase();
        const matchSearch =
          !q ||
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'All' || item.status === statusFilter;
        const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
        const matchPriority = priorityFilter === 'All' || item.priority === priorityFilter;
        return matchSearch && matchStatus && matchCategory && matchPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'upvotes') return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
        return 0;
      });
  }, [grievances, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const stats = useMemo(() => {
    return {
      total: grievances.length,
      pending: grievances.filter((g) => g.status === 'Pending').length,
      inProgress: grievances.filter((g) => g.status === 'In Progress').length,
      resolved: grievances.filter((g) => g.status === 'Resolved').length,
    };
  }, [grievances]);

  if (!staffInfo) return null;

  const initials = staffInfo.name
    ? staffInfo.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const inputClass =
    'h-9 px-3 rounded-lg border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-sm text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark';

  const navItems = [
    { key: 'assigned', label: isHOD ? 'All complaints' : 'Assigned complaints', icon: Inbox },
    { key: 'escalated', label: 'Escalated complaints', icon: AlertTriangle },
    { key: 'resolved', label: 'Resolved complaints', icon: CheckCheck },
  ];

  return (
    <div className="min-h-screen flex bg-bg dark:bg-bg-dark transition-colors">
      {/* Mobile / tablet top bar — hamburger trigger, hidden on desktop (lg+) */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-white shadow-md shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-body text-base font-bold tracking-tight text-text-primary dark:text-text-primary-dark truncate">
            Grievance<span className="text-primary dark:text-secondary-dark">Flow</span>
          </span>
        </Link>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          aria-expanded={sidebarOpen}
          className="flex items-center justify-center h-9 w-9 rounded-lg text-text-primary dark:text-text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Sidebar — brand, identity, nav, theme toggle, and logout all live here.
          On mobile/tablet it becomes a full-screen takeover triggered by the hamburger;
          on lg+ screens it's the persistent 64-wide sticky sidebar. */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/40"
            />
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="lg:hidden fixed inset-0 z-50 h-screen w-full bg-surface dark:bg-surface-dark flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-border dark:border-border-dark">
                <Link href="/" className="flex items-center gap-3 min-w-0" onClick={() => setSidebarOpen(false)}>
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-white shadow-md shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col leading-none min-w-0">
                    <span className="font-body text-lg font-bold tracking-tight text-text-primary dark:text-text-primary-dark truncate">
                      Grievance<span className="text-primary dark:text-secondary-dark">Flow</span>
                    </span>
                    <span className="text-[10px] font-semibold tracking-widest text-text-secondary dark:text-text-secondary-dark uppercase mt-0.5">
                      Staff Portal
                    </span>
                  </div>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                  className="flex items-center justify-center h-9 w-9 rounded-lg text-text-primary dark:text-text-primary-dark hover:bg-danger/10 hover:text-danger dark:hover:bg-danger-dark/10 dark:hover:text-danger-dark transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Staff identity */}
              <div className="p-5 border-b border-border dark:border-border-dark">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent dark:from-primary-dark dark:to-accent-dark text-white flex items-center justify-center text-sm font-medium shadow-sm"
                    title={staffInfo.name}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
                      {staffInfo.name}
                    </p>
                    <p className="text-xs text-text-secondary dark:text-text-secondary-dark truncate">
                      {staffInfo.role}
                      {staffInfo.category ? ` · ${staffInfo.category}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 p-3 space-y-1">
                {navItems.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => selectTab(key)}
                    className={`relative w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === key
                      ? 'text-white'
                      : 'text-text-secondary dark:text-text-secondary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10'
                      }`}
                  >
                    {tab === key && (
                      <motion.span
                        layoutId="mobile-nav-highlight"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Theme toggle + logout */}
              <div className="p-3 border-t border-border dark:border-border-dark space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">Theme</span>
                  <ThemeToggle />
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-1.5 justify-center rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3.5 py-2.5 text-xs font-semibold text-text-primary dark:text-text-primary-dark hover:bg-danger/10 hover:text-danger hover:border-danger/30 dark:hover:bg-danger-dark/10 dark:hover:text-danger-dark dark:hover:border-danger-dark/30 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar — unchanged persistent layout for lg+ screens */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="hidden lg:flex w-64 h-screen sticky top-0 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark flex-col shrink-0 transition-colors overflow-y-auto"
      >
        <Link href="/" className="flex items-center gap-3 min-w-0 p-5 border-b border-border dark:border-border-dark">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-white shadow-md shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none min-w-0">
            <span className="font-body text-lg font-bold tracking-tight text-text-primary dark:text-text-primary-dark truncate">
              Grievance<span className="text-primary dark:text-secondary-dark">Flow</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-text-secondary dark:text-text-secondary-dark uppercase mt-0.5">
              Staff Portal
            </span>
          </div>
        </Link>

        {/* Staff identity */}
        <div className="p-5 border-b border-border dark:border-border-dark">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent dark:from-primary-dark dark:to-accent-dark text-white flex items-center justify-center text-sm font-medium shadow-sm"
              title={staffInfo.name}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
                {staffInfo.name}
              </p>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark truncate">
                {staffInfo.role}
                {staffInfo.category ? ` · ${staffInfo.category}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key
                ? 'text-white'
                : 'text-text-secondary dark:text-text-secondary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10'
                }`}
            >
              {tab === key && (
                <motion.span
                  layoutId="desktop-nav-highlight"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </span>
            </button>
          ))}
        </nav>

        {/* Theme toggle + logout */}
        <div className="p-3 border-t border-border dark:border-border-dark space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">Theme</span>
            <ThemeToggle />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-1.5 justify-center rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3.5 py-2 text-xs font-semibold text-text-primary dark:text-text-primary-dark hover:bg-danger/10 hover:text-danger hover:border-danger/30 dark:hover:bg-danger-dark/10 dark:hover:text-danger-dark dark:hover:border-danger-dark/30 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 p-4 pt-20 lg:p-8 lg:pt-8 overflow-x-auto bg-bg dark:bg-bg-dark transition-colors">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <h1 className="text-xl sm:text-2xl font-heading font-semibold text-text-primary dark:text-text-primary-dark">
            {tab === 'assigned'
              ? isHOD ? 'All complaints' : 'Assigned complaints'
              : tab === 'escalated'
                ? 'Escalated complaints'
                : 'Resolved complaints'}
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
            {tab === 'assigned'
              ? isHOD
                ? 'Every open complaint across categories.'
                : `Complaints filed under ${staffInfo.category || 'your'} category.`
              : tab === 'escalated'
                ? isHOD
                  ? 'Complaints unresolved for more than three days. You can update their status.'
                  : 'Complaints unresolved for more than three days in your category. Status changes are made by the HOD.'
                : isHOD
                  ? 'All resolved complaints across categories. You can still reopen one if needed.'
                  : `Resolved complaints in ${staffInfo.category || 'your'} category.`}
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard label="Total complaints" value={stats.total} icon={ClipboardList} tone="primary" index={0} />
          <StatCard label="Pending" value={stats.pending} icon={Clock3} tone="warning" index={1} />
          <StatCard label="In progress" value={stats.inProgress} icon={Loader2} tone="secondary" index={2} />
          <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} tone="success" index={3} />
        </div>

        {/* Search + filters */}
        <div className="mb-6 rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-4 space-y-3">
          <div className="relative w-full">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description…"
              className={`${inputClass} w-full pl-9 bg-bg dark:bg-bg-dark`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={inputClass}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All categories' : c}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={inputClass}
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All priorities' : p}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={inputClass}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="upvotes">Most upvoted</option>
            </select>

            <span className="ml-auto text-xs text-text-secondary dark:text-text-secondary-dark">
              {filteredGrievances.length} of {grievances.length}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-danger/10 border border-danger/30 dark:bg-danger-dark/10 dark:border-danger-dark/30 px-4 py-3">
            <p className="text-sm text-danger dark:text-danger-dark">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-5 h-40 animate-pulse"
              />
            ))}
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-6 py-12 text-center transition-colors">
            <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">No complaints here.</p>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
              {grievances.length === 0 ? 'Nothing in this view right now.' : 'No complaints match your filters.'}
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredGrievances.map((g, index) => {
                const style = STATUS_STYLES[g.status] || STATUS_STYLES.Pending;
                return (
                  <motion.div
                    key={g._id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.03 }}
                    whileHover={{ y: -4 }}
                    className={`flex flex-col rounded-2xl border border-border dark:border-border-dark p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-4 ${style.topBorder} ${tab === 'escalated'
                      ? 'bg-danger/5 dark:bg-danger-dark/10'
                      : tab === 'resolved'
                        ? 'bg-success/5 dark:bg-success-dark/10'
                        : 'bg-surface dark:bg-surface-dark'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-accent/10 text-accent dark:bg-accent-dark/10 dark:text-accent-dark border border-accent/20 dark:border-accent-dark/30">
                        {g.category}
                      </span>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${PRIORITY_STYLES[g.priority] || PRIORITY_STYLES.Low
                          }`}
                      >
                        {g.priority}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-2 line-clamp-2">
                      {g.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-text-secondary dark:text-text-secondary-dark mb-4 mt-auto">
                      <UserRound className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {g.student?.nameAadhar}{' '}
                        <span className="text-text-secondary/70 dark:text-text-secondary-dark/70">
                          ({g.student?.rollNo})
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-border dark:border-border-dark">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.pill}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {g.status}
                      </span>

                      {isHOD ? (
                        <select
                          value={g.status}
                          onChange={(e) => updateStatus(g._id, e.target.value)}
                          className="h-8 px-2 rounded-md border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-xs text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : tab === 'escalated' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-danger dark:text-danger-dark">
                          <AlertTriangle className="h-3 w-3" />
                          Escalated to HOD
                        </span>
                      ) : (
                        <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark italic">
                          HOD only
                        </span>

                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
