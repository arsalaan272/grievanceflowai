"use client"
import { useState, Fragment } from 'react';
import { Lock, Eye } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Props:
 * - grievances: array of grievance objects (used to populate the selector dropdown)
 * - selectedTrackerId: string
 * - setSelectedTrackerId: (id: string) => void
 * - currentTrackerGrievance: the grievance object currently being inspected (or null)
 * - getStatusBadge: (status: string) => string  (tailwind class helper)
 * - getPriorityBadge: (priority: string) => JSX/string (tailwind class helper, returns a span for priority)
 */
export default function TrackGrievance({
  grievances,
  selectedTrackerId,
  setSelectedTrackerId,
  currentTrackerGrievance,
  getStatusBadge,
  getPriorityBadge,
}) {
  const [trackerIdInput, setTrackerIdInput] = useState('');
  const [lookupError, setLookupError] = useState('');

  const handleIdLookup = (e) => {
    e.preventDefault();
    const trimmedId = trackerIdInput.trim();
    if (!trimmedId) return;

    const match = grievances.find((g) => g._id === trimmedId);
    if (match) {
      setSelectedTrackerId(match._id);
      setLookupError('');
    } else {
      setLookupError('No complaint found with this Reference Key.');
    }
  };

  return (
    <motion.div
      key="track-pane"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Tracker Selector Dropdown */}
      <div className="p-5 rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base">Select Grievance to Inspect</h3>
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">Choose any of your complaints to load resolution steps.</p>
        </div>
        <select
          value={selectedTrackerId}
          onChange={(e) => setSelectedTrackerId(e.target.value)}
          className="bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-xs font-semibold max-w-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
        >
          {grievances.map(g => (
            <option key={g._id} value={g._id}>
              {g.title.slice(0, 42)}... ({g.status})
            </option>
          ))}
          {grievances.length === 0 && <option value="">No registered complaints</option>}
        </select>
      </div>

      {/* Reference Key lookup */}
      <div className="px-5 pb-5 -mt-3 rounded-3xl">
        <form onSubmit={handleIdLookup} className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-border/80 dark:border-border-dark">
          <label className="text-xs font-semibold text-text-secondary dark:text-text-secondary-dark whitespace-nowrap">Or enter Reference Key:</label>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={trackerIdInput}
              onChange={(e) => setTrackerIdInput(e.target.value)}
              placeholder="e.g. 6a5bc5be03895efcbfe7b67c"
              className="flex-1 bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Track
            </button>
          </div>
        </form>
        {lookupError && (
          <p className="text-[11px] text-red-500 mt-2 font-semibold">{lookupError}</p>
        )}
      </div>

      {/* Main Tracker Container */}
      {currentTrackerGrievance ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Complaint metadata details */}
          <div className="rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] p-6 space-y-4">
            <div>
              <div className="flex gap-2">
                <span className="bg-bg dark:bg-bg-dark text-text-secondary dark:text-text-secondary-dark px-2.5 py-1 rounded-full text-[10px] font-bold border border-border dark:border-border-dark">
                  {currentTrackerGrievance.category}
                </span>
                {getPriorityBadge(currentTrackerGrievance.priority)}
              </div>
              <h4 className="font-heading font-bold text-lg mt-3">{currentTrackerGrievance.title}</h4>
            </div>

            <p className="text-xs text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              {currentTrackerGrievance.description}
            </p>

            <div className="pt-4 border-t border-border/80 dark:border-border-dark space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary dark:text-text-secondary-dark">Reference Key:</span>
                <span className="font-mono font-bold text-primary dark:text-secondary-dark">{currentTrackerGrievance._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary dark:text-text-secondary-dark">Registered Date:</span>
                <span className="font-semibold">{new Date(currentTrackerGrievance.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary dark:text-text-secondary-dark">Publish Visibility:</span>
                <span className="font-semibold flex items-center gap-1">
                  {currentTrackerGrievance.publishToCommunity ? (
                    <><Eye className="h-3.5 w-3.5 text-success" /> Public on Feed</>
                  ) : (
                    <><Lock className="h-3.5 w-3.5 text-text-secondary" /> Private to Staff</>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High-fidelity timeline steps */}
          <div className="lg:col-span-2 rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] p-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-border-dark/80">
              <h4 className="font-heading font-bold text-base">Official Progress Log</h4>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${getStatusBadge(currentTrackerGrievance.status)}`}>
                Status: {currentTrackerGrievance.status}
              </span>
            </div>

            {/* Stage progress bar */}
            <div className="flex items-center mt-6">
              {['Pending', 'In Progress', 'Resolved'].map((step, idx, arr) => {
                const currentIndex = arr.indexOf(currentTrackerGrievance.status);
                const isReached = idx <= currentIndex;
                const isFinal = idx === arr.length - 1;
                return (
                  <Fragment key={step}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                        isReached
                          ? (isFinal ? 'bg-success border-success' : 'bg-primary border-primary')
                          : 'bg-transparent border-border dark:border-border-dark'
                      } ${idx === currentIndex && !isFinal ? 'ring-4 ring-primary/20' : ''}`} />
                      <span className={`text-[10px] font-semibold whitespace-nowrap ${
                        isReached ? 'text-text dark:text-text-dark' : 'text-text-secondary dark:text-text-secondary-dark'
                      }`}>
                        {step}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1 mb-4 rounded-full overflow-hidden bg-border dark:bg-border-dark">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: idx < currentIndex ? '100%' : '0%' }}
                          transition={{ duration: 0.6 }}
                          className="h-full bg-primary"
                        />
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>

            {/* Timeline flow */}
            <div className="relative mt-8 pl-8 space-y-8">
              {/* Vertical line through timeline checkpoints */}
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-border dark:bg-border-dark" />

              {currentTrackerGrievance.updates?.map((up, idx) => {
                const isLast = idx === currentTrackerGrievance.updates.length - 1;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative"
                  >
                    {/* Indicator dot */}
                    <div className={`absolute -left-8 mt-1 h-3.5 w-3.5 rounded-full border-2 border-surface dark:border-[#16161B] flex items-center justify-center ${
                      isLast && currentTrackerGrievance.status === 'Resolved'
                        ? 'bg-success h-4 w-4 -left-[34px]'
                        : isLast
                        ? 'bg-primary h-4 w-4 -left-[34px] animate-pulse'
                        : 'bg-text-secondary'
                    }`} />

                    <div>
                      <div className="flex items-center gap-2.5">
                        <h5 className="font-heading font-bold text-sm">{up.title}</h5>
                        <span className="text-[10px] text-text-secondary/80 dark:text-text-secondary-dark/80 bg-bg dark:bg-bg-dark px-2 py-0.5 rounded-md font-semibold border border-border/50 dark:border-border-dark/50">
                          {up.date}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1 max-w-xl leading-relaxed">
                        {up.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* If status is Pending or In Progress, show prospective next checkpoint */}
              {currentTrackerGrievance.status !== 'Resolved' && (
                <div className="relative opacity-60">
                  <div className="absolute -left-8 mt-1 h-3.5 w-3.5 rounded-full border-2 border-dashed border-border dark:border-border-dark bg-transparent" />
                  <div>
                    <h5 className="font-heading font-semibold text-sm text-text-secondary">Awaiting Final Resolution</h5>
                    <p className="text-xs text-text-secondary/70 mt-0.5">The coordinator will certify and close once resolved.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border dark:border-border-dark p-12 text-center">
          <p className="text-sm text-text-secondary">No grievances to track. File one to start tracking!</p>
        </div>
      )}
    </motion.div>
  );
}