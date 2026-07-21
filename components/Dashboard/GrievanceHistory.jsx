"use client"
import { Search, Filter, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Props:
 * - searchQuery, setSearchQuery
 * - statusFilter, setStatusFilter
 * - categoryFilter, setCategoryFilter
 * - priorityFilter, setPriorityFilter
 * - sortBy, setSortBy
 * - filteredHistoryGrievances: array (already filtered/sorted list to render)
 * - getStatusBadge: (status) => className string
 * - getPriorityBadge: (priority) => JSX/string
 * - selectTrackerForGrievance: (id) => void  (jumps to track tab for a given grievance)
 * - openDetails: (grievance) => void  (opens the complaint details modal)
 */
export default function GrievanceHistory({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  filteredHistoryGrievances,
  getStatusBadge,
  getPriorityBadge,
  selectTrackerForGrievance,
  openDetails,
}) {
  return (
    <motion.div
      key="history-pane"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Search, Filter & Sort Controls Grid */}
      <div className="rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search through title or description details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all placeholder:text-text-secondary/50"
            />
          </div>

          {/* Sorting Toggle */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>

        </div>

        {/* Category and Priority Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/60 dark:border-border-dark/60">
          <span className="text-xs font-bold text-text-secondary dark:text-text-secondary-dark flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter Dossier:
          </span>

          {/* Category Filter */}
          <div className="flex gap-1.5 items-center">
            <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Hostel">Hostel</option>
              <option value="Administration">Administration</option>
              <option value="Faculty">Faculty</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex gap-1.5 items-center">
            <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none transition-all cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Grievance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHistoryGrievances.map((item) => (
          <div
            key={item._id}
            className="group rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] p-5 flex flex-col justify-between hover:border-primary/30 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => openDetails(item)}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="bg-bg dark:bg-bg-dark text-text-secondary dark:text-text-secondary-dark px-2.5 py-1 rounded-full text-[10px] font-bold border border-border dark:border-border-dark">
                  {item.category}
                </span>
              </div>

              <h4 className="font-heading font-bold text-sm mt-3 tracking-tight group-hover:text-primary dark:group-hover:text-secondary-dark transition-colors">
                {item.title}
              </h4>

              <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-2 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-border/80 dark:border-border-dark/85 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {getPriorityBadge(item.priority)}
                <span className="text-[10px] text-text-secondary/70 dark:text-text-secondary-dark/60 font-semibold">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); selectTrackerForGrievance(item._id); }}
                className="text-[11px] font-bold text-primary dark:text-secondary-dark flex items-center gap-0.5 cursor-pointer"
              >
                Trace Step <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredHistoryGrievances.length === 0 && (
          <div className="md:col-span-2 text-center py-12 bg-surface dark:bg-[#16161B] border border-dashed border-border dark:border-border-dark rounded-3xl">
            <p className="text-sm text-text-secondary">No grievances match the filtered criteria.</p>
            <button
              onClick={() => {
                setStatusFilter('All');
                setCategoryFilter('All');
                setPriorityFilter('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-primary underline"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}