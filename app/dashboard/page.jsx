"use client"
import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Clock,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Calendar,
  Megaphone,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';

import FileGrievanceForm from '@/components/Dashboard/FileGrievanceForm';
import TrackGrievance from '@/components/Dashboard/TrackGrievance';
import GrievanceHistory from '@/components/Dashboard/GrievanceHistory';
import ComplaintDetailsModal from '@/components/Dashboard/ComplaintDetailsModal';
import CommunityFeed from '@/components/Dashboard/CommunityFeed';
import CategoryBarChart from '@/components/Dashboard/Categorybarchart';

export default function dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const [studentEmail, setStudentEmail] = useState('');
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Input states for filing
  const [newGrievance, setNewGrievance] = useState({
    title: '',
    description: '',
    category: 'Academic',
    priority: 'Medium',
    isPublished: false
  });
  const [fileSuccess, setFileSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // States for timeline tracking
  const [selectedTrackerId, setSelectedTrackerId] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsGrievance, setDetailsGrievance] = useState(null);

  // States for history filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, upvotes

  // State for Community Feed comment
  const [newCommentText, setNewCommentText] = useState({});

  // Fetch grievances from the backend on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedStudent = localStorage.getItem('student');

    if (!token) {
      router.push('/login');
      return;
    }

    if (storedStudent) {
      try {
        const parsed = JSON.parse(storedStudent);
        setStudentName(parsed.nameAadhar || parsed.name || 'Student');
        setStudentEmail(parsed.email || '');
        setStudentDetails(parsed);
      } catch (e) {
        // use default
      }
    }

    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grievances/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Unable to load your complaints.');
          setGrievances([]);
          return;
        }

        setGrievances(data);
      } catch (err) {
        setError('Could not connect to the server. Please try again shortly.');
        setGrievances([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    router.push('/login');
  };

  // Stat counting calculations
  const totalComplaints = grievances.length;
  const pendingCount = grievances.filter(item => item.status === 'Pending').length;
  const inProgressCount = grievances.filter(item => item.status === 'In Progress').length;
  const resolvedCount = grievances.filter(item => item.status === 'Resolved').length;

  const statCards = [
    {
      label: 'Total Complaints',
      value: totalComplaints,
      hint: 'All complaints submitted.',
      colorClass: 'text-text-primary dark:text-emerald-400',
      icon: Clock,
    },
    {
      label: 'Pending Review',
      value: pendingCount,
      hint: 'Waiting for coordinator.',
      colorClass: 'text-warning dark:text-warning-dark',
      icon: AlertCircle,
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      hint: 'Under active resolution.',
      colorClass: 'text-secondary dark:text-secondary-dark',
      icon: PlayCircle,
    },
    {
      label: 'Resolved Issues',
      value: resolvedCount,
      hint: 'Closed and certified.',
      colorClass: 'text-success dark:text-success-dark',
      icon: CheckCircle,
    },
  ];

  // Submit a new complaint
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFileSuccess(false);
    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grievances/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGrievance),
      });
      const data = await res.json();
      if (res.ok) {
        setGrievances([data, ...grievances]);
        setFileSuccess(true);
        setNewGrievance({ title: '', description: '', category: 'Academic', priority: 'Medium', isPublished: false });
      } else {
        setError(data.message || 'Failed to submit grievance');
      }
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upvote complaint in Community Feed
  const handleUpvote = async (id) => {
    const token = localStorage.getItem('token');
    const target = grievances.find(g => g._id === id);
    if (!target) return;

    const alreadyUpvoted = target.upvotes?.includes(studentEmail);
    const optimisticUpvotes = alreadyUpvoted
      ? target.upvotes.filter(email => email !== studentEmail)
      : [...(target.upvotes || []), studentEmail];

    setGrievances(grievances.map(g => g._id === id ? { ...g, upvotes: optimisticUpvotes } : g));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grievances/${id}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      // Keep optimistic update even if sync fails silently
    }
  };

  // Comment on community grievance
  const handleAddComment = async (id) => {
    const text = newCommentText[id];
    if (!text || !text.trim()) return;

    const token = localStorage.getItem('token');
    const newComment = {
      _id: `c-${Date.now()}`,
      author: studentName,
      content: text.trim(),
      createdAt: new Date().toISOString()
    };

    setGrievances(grievances.map(g => g._id === id ? { ...g, comments: [...(g.comments || []), newComment] } : g));
    setNewCommentText({ ...newCommentText, [id]: '' });

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grievances/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text.trim() }),
      });
    } catch (err) {
      // Keep optimistic update even if sync fails silently
    }
  };

  // Timeline tracker selected grievance
  const currentTrackerGrievance = useMemo(() => {
    if (selectedTrackerId) {
      return grievances.find(g => g._id === selectedTrackerId);
    }
    return grievances[0] || null;
  }, [selectedTrackerId, grievances]);

  // Handle direct tab routing shortcuts
  const selectTrackerForGrievance = (id) => {
    setSelectedTrackerId(id);
    setActiveTab('track');
  };

  // Open the details modal for a given grievance
  const openDetails = (grievance) => {
    setDetailsGrievance(grievance);
  };

  // Filtered grievances list for "History" search
  const filteredHistoryGrievances = useMemo(() => {
    return grievances.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchPriority = priorityFilter === 'All' || item.priority === priorityFilter;
      return matchSearch && matchStatus && matchCategory && matchPriority;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'upvotes') return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
      return 0;
    });
  }, [grievances, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  // Feed items list
  const communityGrievances = useMemo(() => {
    return grievances.filter(item => item.isPublished === true);
  }, [grievances]);

  // Badge styler helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning/10 text-warning dark:bg-warning-dark/10 dark:text-warning-dark border border-warning/20';
      case 'In Progress':
        return 'bg-secondary/10 text-secondary dark:bg-secondary-dark/15 dark:text-secondary-dark border border-secondary/20';
      case 'Resolved':
        return 'bg-success/10 text-success dark:bg-success-dark/10 dark:text-success-dark border border-success/20';
      default:
        return 'bg-surface text-text-primary border border-border';
    }
  };

  // Priority badge styler
  const getPriorityBadge = (p) => {
    const styles = {
      High: 'bg-danger/10 text-danger border border-danger/25',
      Medium: 'bg-warning/10 text-warning border border-warning/25',
      Low: 'bg-primary/10 text-primary border border-primary/25',
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-transform duration-200 hover:scale-105 inline-block ${styles[p] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
        {p}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark transition-colors duration-200 text-text-primary dark:text-text-primary-dark">

      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Layout Container - dynamically shifts based on sidebar expansion */}
      <div
        className={`transition-all duration-300 ease-out min-h-screen flex flex-col pl-0 ${isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[280px]'
          }`}
      >

        {/* Top Navbar Header */}
        <motion.header
          id="top-portal-navbar"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          // after
          // after
          className="h-16 border-b border-border dark:border-border-dark bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-md pl-16 pr-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.h2
                key={activeTab}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="font-heading font-bold text-lg hidden sm:block"
              >
                {activeTab === 'overview' && 'Student Overview Panel'}
                {activeTab === 'file' && 'Submit New Grievance'}
                {activeTab === 'track' && 'Resolution Timeline Tracker'}
                {activeTab === 'history' && 'Complaint Dossier & History'}
                {activeTab === 'feed' && 'Student Community Feed'}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            {/* Custom Theme Switcher */}
            <ThemeToggle />

            {/* Profile badge */}
            <div className="flex items-center gap-3 pl-3 border-l border-border dark:border-border-dark">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold leading-none">{studentName}</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold shadow-sm cursor-default"
                title={studentName}
              >
                {studentName.charAt(0)}
              </motion.div>
            </div>

            {/* Logout button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-3.5 py-2 text-xs font-semibold text-text-primary dark:text-text-primary-dark hover:bg-danger/10 hover:text-danger hover:border-danger/30 dark:hover:bg-danger-dark/10 dark:hover:text-danger-dark dark:hover:border-danger-dark/30 transition-all duration-200 cursor-pointer"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">

            {/* 1. OVERVIEW DASHBOARD VIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Greeting Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/5 border border-primary/20 dark:border-primary-dark/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary-dark">
                      Welcome Back, {studentName}!
                    </h3>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
                      File new grievances, track resolution milestones, and keep up with campus student affairs.
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 bg-surface dark:bg-surface-dark px-4 py-2 rounded-2xl border border-border dark:border-border-dark self-start md:self-auto shadow-sm cursor-default"
                  >
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">
                      {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </motion.div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger dark:text-danger-dark text-xs flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Dashboard Stats Row */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.08, ease: 'easeOut' }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className={`group relative rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#080108]/50 p-5 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark">
                              {card.label}
                            </p>
                            <p className={`text-4xl font-heading font-bold mt-2 ${card.colorClass}`}>
                              {card.value}
                            </p>
                          </div>
                          <div className="h-10 w-10 rounded-xl bg-bg dark:bg-bg-dark flex items-center justify-center border border-border dark:border-border-dark group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                            <Icon className={`h-5 w-5 ${card.colorClass}`} />
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-3">{card.hint}</p>
                      </motion.div>
                    );
                  })}
                </section>

                {/* Recent Submissions and Quick Actions Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Left Column: Recent Grievances */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                    className="lg:col-span-2 rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#080108]/50 p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-lg">My Recent Grievances</h4>
                        <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">Quickly view status or jump to tracker timeline.</p>
                      </div>
                      <motion.button
                        whileHover={{ x: 3 }}
                        onClick={() => setActiveTab('history')}
                        className="text-xs font-bold text-primary dark:text-secondary-dark hover:underline flex items-center gap-1"
                      >
                        See All <ArrowRight className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>

                    <div className="space-y-3.5 mt-4">
                      {loading ? (
                        <p className="text-sm text-text-secondary dark:text-text-secondary-dark py-6 text-center">Loading complaints...</p>
                      ) : (
                        <>
                          {grievances.slice(0, 3).map((item, idx) => (
                            <motion.div
                              key={item._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.2 + idx * 0.08 }}
                              whileHover={{ scale: 1.01, y: -2 }}
                              className="p-4 rounded-2xl border border-border/80 dark:border-border-dark bg-bg/50 dark:bg-bg-dark/30 hover:border-primary/30 dark:hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
                              onClick={() => openDetails(item)}
                            >
                              <div>
                                <span className="text-[10px] font-semibold text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                                  {item.category}
                                </span>
                                <h5 className="font-heading font-bold text-sm mt-0.5">{item.title}</h5>
                              </div>

                              <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-2 line-clamp-2">
                                {item.description}
                              </p>

                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 dark:border-border-dark/50">
                                <span className="text-[10px] text-text-secondary/70 dark:text-text-secondary-dark/70">
                                  Filed on {new Date(item.createdAt).toLocaleDateString()}
                                </span>

                                <button
                                  onClick={(e) => { e.stopPropagation(); selectTrackerForGrievance(item._id); }}
                                  className="text-[11px] font-bold text-primary dark:text-secondary-dark hover:text-primary-hover flex items-center gap-1 cursor-pointer transition-transform duration-150 hover:translate-x-0.5"
                                >
                                  Track Status <ChevronRight className="h-3 w-3" />
                                </button>
                              </div>
                            </motion.div>
                          ))}

                          {grievances.length === 0 && (
                            <div className="text-center py-10 border border-dashed border-border dark:border-border-dark rounded-2xl">
                              <p className="text-sm text-text-secondary">You haven't submitted any complaints yet.</p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab('file')}
                                className="mt-3 text-xs font-bold text-primary dark:text-secondary-dark flex items-center gap-1 mx-auto bg-primary/10 dark:bg-primary-dark/20 px-3.5 py-1.5 rounded-full"
                              >
                                <Plus className="h-3.5 w-3.5" /> File Your First Grievance
                              </motion.button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>

                  {/* Right Column: Portal Utilities & Quick Category Breakdown */}
                  <div className="space-y-6">
                    {/* Category Breakdown (Native SVG mini ring chart to keep page fully customized) */}
                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                      whileHover={{ y: -3 }}
                      className="rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B]/20 p-6 transition-shadow duration-300 hover:shadow-lg"
                    >
                      <h4 className="font-heading font-bold text-base">Category Distribution</h4>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">Overview of complaints by division.</p>

                      <div className="flex items-center gap-4 mt-6">
                        {/* SVG Pie Chart */}
                        <motion.svg
                          initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
                          animate={{ opacity: 1, scale: 1, rotate: -90 }}
                          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                          className="w-24 h-24 shrink-0"
                          viewBox="0 0 36 36"
                        >
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E4E7EB" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0891B2" strokeWidth="3" strokeDasharray="40 100" strokeDashoffset="0" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4C5FD5" strokeWidth="3" strokeDasharray="30 100" strokeDashoffset="-40" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#9A2FE6" strokeWidth="3" strokeDasharray="20 100" strokeDashoffset="-70" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#DC2626" strokeWidth="3" strokeDasharray="10 100" strokeDashoffset="-90" />
                        </motion.svg>

                        <div className="space-y-1.5 text-xs w-full">
                          <div className="flex items-center justify-between transition-transform duration-150 hover:translate-x-0.5">
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Academic</span>
                            <span className="font-bold">40%</span>
                          </div>
                          <div className="flex items-center justify-between transition-transform duration-150 hover:translate-x-0.5">
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary" /> Hostel</span>
                            <span className="font-bold">30%</span>
                          </div>
                          <div className="flex items-center justify-between transition-transform duration-150 hover:translate-x-0.5">
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Admin</span>
                            <span className="font-bold">20%</span>
                          </div>
                          <div className="flex items-center justify-between transition-transform duration-150 hover:translate-x-0.5">
                            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger" /> Other</span>
                            <span className="font-bold">10%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* adding the bar grpah*/}
                    <CategoryBarChart />

                  </div>

                </div>
              </motion.div>
            )}

            {/* 2. FILE GRIEVANCE VIEW */}
            {activeTab === 'file' && (
              <FileGrievanceForm
                newGrievance={newGrievance}
                setNewGrievance={setNewGrievance}
                handleFileSubmit={handleFileSubmit}
                isSubmitting={isSubmitting}
                error={error}
                fileSuccess={fileSuccess}
                setActiveTab={setActiveTab}
              />
            )}

            {/* 3. TRACK STATUS TIMELINE VIEW */}
            {activeTab === 'track' && (
              <TrackGrievance
                grievances={grievances}
                selectedTrackerId={selectedTrackerId}
                setSelectedTrackerId={setSelectedTrackerId}
                currentTrackerGrievance={currentTrackerGrievance}
                getStatusBadge={getStatusBadge}
                getPriorityBadge={getPriorityBadge}
              />
            )}

            {/* 4. COMPLAINT HISTORY (VIEW & FILTER) VIEW */}
            {activeTab === 'history' && (
              <GrievanceHistory
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filteredHistoryGrievances={filteredHistoryGrievances}
                getStatusBadge={getStatusBadge}
                getPriorityBadge={getPriorityBadge}
                selectTrackerForGrievance={selectTrackerForGrievance}
                openDetails={openDetails}
              />
            )}

            {/* 5. COMMUNITY FEED VIEW */}
            {activeTab === 'feed' && (
              <CommunityFeed
                communityGrievances={communityGrievances}
                studentEmail={studentEmail}
                handleUpvote={handleUpvote}
                newCommentText={newCommentText}
                setNewCommentText={setNewCommentText}
                handleAddComment={handleAddComment}
                setActiveTab={setActiveTab}
              />
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Complaint Details Modal */}
      <ComplaintDetailsModal
        grievance={detailsGrievance}
        student={studentDetails}
        onClose={() => setDetailsGrievance(null)}
        getStatusBadge={getStatusBadge}
        getPriorityBadge={getPriorityBadge}
      />

      {/* Floating Fast Action Submit Button - bottom right */}
      {
        activeTab !== 'file' && !isMobileSidebarOpen && (
          <motion.button
            id="portal-floating-action"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={() => setActiveTab('file')}
            className="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 shadow-xl bg-primary hover:bg-primary-hover dark:bg-secondary dark:hover:bg-secondary-hover text-white transition-colors duration-200 cursor-pointer border border-white/10"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
              <Plus className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="font-semibold text-xs uppercase tracking-wider">New Complaint</span>
          </motion.button>
        )
      } 

    </div >
  );
}