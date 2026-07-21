'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import ThemeToggle from '@/components/ThemeToggle';
import { LogOut, ShieldCheck, Search } from 'lucide-react';

const STATUS_STYLES = {
  Pending: {
    border: 'border-l-warning dark:border-l-warning-dark',
    pill: 'bg-warning/10 text-warning border-warning/30 dark:bg-warning-dark/10 dark:text-warning-dark dark:border-warning-dark/30',
  },
  'In Progress': {
    border: 'border-l-secondary dark:border-l-secondary-dark',
    pill: 'bg-secondary/10 text-secondary border-secondary/30 dark:bg-secondary-dark/10 dark:text-secondary-dark dark:border-secondary-dark/30',
  },
  Resolved: {
    border: 'border-l-success dark:border-l-success-dark',
    pill: 'bg-success/10 text-success border-success/30 dark:bg-success-dark/10 dark:text-success-dark dark:border-success-dark/30',
  },
};

export default function StaffDashboard() {
  const [tab, setTab] = useState('assigned');
  const [grievances, setGrievances] = useState([]);
  const [staffInfo, setStaffInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
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

  // Only the HOD can change a complaint's status. Everyone else (wardens,
  // lecturers, etc.) can view assigned/escalated complaints but the status
  // control is read-only for them.
  const isHOD = staffInfo?.role === 'HOD';

  const fetchGrievances = async () => {
    setError('');
    setLoading(true);
    const token = localStorage.getItem('staffToken');
    const endpoint = tab === 'assigned' ? 'assigned' : 'escalated';

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

  if (!staffInfo) return null;

  const initials = staffInfo.name
    ? staffInfo.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const inputClass =
    'h-9 px-3 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-sm text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark';

  return (
    <div className="min-h-screen flex bg-bg dark:bg-bg-dark transition-colors">
      {/* Sidebar — brand, identity, nav, theme toggle, and logout all live here now */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-64 h-screen sticky top-0 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark flex flex-col shrink-0 transition-colors overflow-y-auto">
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
          <button
            onClick={() => setTab('assigned')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'assigned'
                ? 'bg-primary dark:bg-primary-dark text-white'
                : 'text-text-secondary dark:text-text-secondary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10'
            }`}
          >
            {isHOD ? 'All complaints' : 'Assigned complaints'}
          </button>

          {/* Escalated tab is now visible to everyone — wardens and lecturers
              can view escalated complaints in their own category, they just
              can't change the status (only the HOD can). */}
          <button
            onClick={() => setTab('escalated')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'escalated'
                ? 'bg-primary dark:bg-primary-dark text-white'
                : 'text-text-secondary dark:text-text-secondary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10'
            }`}
          >
            Escalated complaints
          </button>
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
      <main className="flex-1 p-8 overflow-x-auto bg-bg dark:bg-bg-dark transition-colors">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
            {tab === 'assigned'
              ? isHOD ? 'All complaints' : 'Assigned complaints'
              : 'Escalated complaints'}
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
            {tab === 'assigned'
              ? isHOD
                ? 'Every open complaint across categories.'
                : `Complaints filed under ${staffInfo.category || 'your'} category.`
              : isHOD
                ? 'Complaints unresolved for more than three days. You can update their status.'
                : 'Complaints unresolved for more than three days in your category. Status changes are made by the HOD.'}
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description…"
              className={`${inputClass} w-full pl-9`}
            />
          </div>

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
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-danger/10 border border-danger/30 dark:bg-danger-dark/10 dark:border-danger-dark/30 px-4 py-3">
            <p className="text-sm text-danger dark:text-danger-dark">{error}</p>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Loading…</p>
        ) : filteredGrievances.length === 0 ? (
          <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-6 py-12 text-center transition-colors">
            <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">No complaints here.</p>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
              {grievances.length === 0 ? 'Nothing in this view right now.' : 'No complaints match your filters.'}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark overflow-hidden transition-colors">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border dark:border-border-dark bg-bg dark:bg-bg-dark">
                  <th className="text-left font-medium text-text-secondary dark:text-text-secondary-dark px-4 py-3">Title</th>
                  <th className="text-left font-medium text-text-secondary dark:text-text-secondary-dark px-4 py-3">Category</th>
                  <th className="text-left font-medium text-text-secondary dark:text-text-secondary-dark px-4 py-3">Priority</th>
                  <th className="text-left font-medium text-text-secondary dark:text-text-secondary-dark px-4 py-3">Filed by</th>
                  <th className="text-left font-medium text-text-secondary dark:text-text-secondary-dark px-4 py-3">Status</th>
                  <th className="text-left font-medium text-text-secondary dark:text-text-secondary-dark px-4 py-3">
                    {isHOD ? 'Update' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGrievances.map((g) => {
                  const style = STATUS_STYLES[g.status] || STATUS_STYLES.Pending;
                  return (
                    <tr
                      key={g._id}
                      className={`border-b border-border dark:border-border-dark last:border-0 border-l-4 ${style.border}`}
                    >
                      <td className="px-4 py-3 text-text-primary dark:text-text-primary-dark font-medium">{g.title}</td>
                      <td className="px-4 py-3 text-text-secondary dark:text-text-secondary-dark">{g.category}</td>
                      <td className="px-4 py-3 text-text-secondary dark:text-text-secondary-dark">{g.priority}</td>
                      <td className="px-4 py-3 text-text-secondary dark:text-text-secondary-dark">
                        {g.student?.nameAadhar}{' '}
                        <span className="text-text-secondary/70 dark:text-text-secondary-dark/70">
                          ({g.student?.rollNo})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${style.pill}`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isHOD ? (
                          <select
                            value={g.status}
                            onChange={(e) => updateStatus(g._id, e.target.value)}
                            className="h-8 px-2 rounded-md border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-sm text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        ) : (
                          <span className="text-xs text-text-secondary dark:text-text-secondary-dark italic">
                            HOD only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}