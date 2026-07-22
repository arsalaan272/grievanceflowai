"use client"
import { motion } from 'motion/react';
import { Search, ArrowUpDown, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ResolvedComplaints({
  resolvedSearchQuery,
  setResolvedSearchQuery,
  resolvedSortBy,
  setResolvedSortBy,
  filteredResolvedGrievances,
  loading,
  getStatusBadge,
  getPriorityBadge,
  selectTrackerForGrievance,
  openDetails,
}) {
  return (
    <motion.div
      key="resolved-pane"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#080108]/50 p-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="font-heading font-bold text-lg">Resolved Complaints</h3>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
              Complaints that have been marked resolved by staff.
            </p>
          </div>
        </div>

        {/* Search + Sort controls */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark" />
            <input
              type="text"
              value={resolvedSearchQuery}
              onChange={(e) => setResolvedSearchQuery(e.target.value)}
              placeholder="Search resolved complaints..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-sm outline-none focus:border-primary/50 dark:focus:border-primary-dark/50 transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={resolvedSortBy}
              onChange={(e) => setResolvedSortBy(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-2xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark text-sm outline-none focus:border-primary/50 dark:focus:border-primary-dark/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="newest">Recently Resolved</option>
              <option value="oldest">Oldest Resolved</option>
            </select>
            <ArrowUpDown className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark pointer-events-none" />
          </div>
        </div>

        {/* Results list */}
        <div className="space-y-3.5 mt-6">
          {loading ? (
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark py-10 text-center">
              Loading resolved complaints...
            </p>
          ) : filteredResolvedGrievances.length === 0 ? (
            <div className="text-center py-14 border border-dashed border-border dark:border-border-dark rounded-2xl">
              <CheckCircle2 className="h-8 w-8 mx-auto text-text-secondary/40 dark:text-text-secondary-dark/40" />
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-3">
                No resolved complaints yet.
              </p>
            </div>
          ) : (
            filteredResolvedGrievances.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="p-4 rounded-2xl border border-border/80 dark:border-border-dark bg-bg/50 dark:bg-bg-dark/30 hover:border-success/30 dark:hover:border-success-dark/40 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => openDetails(item)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h5 className="font-heading font-bold text-sm mt-0.5">{item.title}</h5>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {getPriorityBadge(item.priority)}
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-2 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 dark:border-border-dark/50">
                  <span className="text-[10px] text-text-secondary/70 dark:text-text-secondary-dark/70">
                    Resolved on {new Date(item.updatedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={(e) => { e.stopPropagation(); selectTrackerForGrievance(item._id); }}
                    className="text-[11px] font-bold text-primary dark:text-secondary-dark hover:text-primary-hover flex items-center gap-1 cursor-pointer transition-transform duration-150 hover:translate-x-0.5"
                  >
                    View Timeline <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}