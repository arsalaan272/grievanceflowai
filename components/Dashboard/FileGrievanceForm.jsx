"use client"
import { useState } from 'react';
import { AlertTriangle, Check, Sparkles, RotateCcw, PenLine, Loader2, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Props:
 * - newGrievance: { title, description, category, priority, publishToCommunity }
 * - setNewGrievance: (updater) => void
 * - handleFileSubmit: (e) => void
 * - isSubmitting: boolean
 * - error: string
 * - fileSuccess: boolean
 * - setActiveTab: (tab: string) => void
 * - polishGrievance: (rawText: string) => Promise<{ title, description, category, priority }>
 *     Should POST to /api/student/polish on port 3001 and return the parsed fields.
 *     If not provided, a local stub is used so the component still runs standalone.
 */
export default function FileGrievanceForm({
  newGrievance,
  setNewGrievance,
  handleFileSubmit,
  isSubmitting,
  error,
  fileSuccess,
  setActiveTab,
  polishGrievance,
}) {
  // 'generate' = show the single-line AI input; 'manual' = show the full form filled/fillable
  const [mode, setMode] = useState('generate');
  const [rawText, setRawText] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishError, setPolishError] = useState('');
  const [isFilled, setIsFilled] = useState(false);

  const CATEGORIES = ['Academic', 'Hostel', 'Administration', 'Faculty', 'Infrastructure', 'Other'];
  const PRIORITIES = ['Low', 'Medium', 'High'];

  const defaultPolish = async (text) => {
    const token = localStorage.getItem('token'); // adjust key if stored under a different name

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grievances/polish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ roughText: text }),
    });
    if (res.status === 401) {
      throw new Error('Your session has expired. Please log in again.');
    }
    if (!res.ok) {
      throw new Error('Could not reach the complaint generator. Try again.');
    }
    const data = await res.json();
    // Expecting { title, description, category, priority } from the backend
    return data;
  };

  const runPolish = async () => {
    if (!rawText.trim()) {
      setPolishError('Type a short line describing the issue first.');
      return;
    }
    setPolishError('');
    setIsPolishing(true);
    try {
      const fn = polishGrievance || defaultPolish;
      const polished = await fn(rawText.trim());

      setNewGrievance((prev) => ({
        ...prev,
        title: polished.title ?? prev.title,
        description: polished.description ?? prev.description,
        category: CATEGORIES.includes(polished.category) ? polished.category : prev.category,
        priority: PRIORITIES.includes(polished.priority) ? polished.priority : prev.priority,
      }));

      setIsFilled(true);
      setMode('manual');
    } catch (err) {
      setPolishError(err?.message || 'Something went wrong while generating the complaint.');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleFillManually = () => {
    setPolishError('');
    setMode('manual');
  };

  const handleRegenerate = () => {
    setIsFilled(false);
    setPolishError('');
    setMode('generate');
  };

  return (
    <motion.div
      key="file-pane"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-xl mx-auto"
    >
      <div className="rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)] transition-colors">
        <div className="flex items-center justify-between border-b border-border dark:border-border-dark pb-5 mb-6">
          <div>
            <h3 className="font-heading font-bold text-xl">File a College Grievance</h3>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
              {mode === 'generate'
                ? 'Describe the issue in one line — we\'ll draft the complaint for you.'
                : 'Submit an issue directly to campus authorities.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('overview')}
            className="text-xs font-bold text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark underline cursor-pointer shrink-0"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger dark:text-danger-dark text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {fileSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-success/10 border border-success/30 text-success dark:text-success-dark text-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 shrink-0 bg-success/20 p-0.5 rounded-full" />
              <span>Grievance successfully registered on the secure network.</span>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="font-bold underline uppercase tracking-wider text-[10px]"
            >
              View List
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'generate' ? (
            <motion.div
              key="generate-pane"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-primary/20 dark:border-secondary/30 bg-primary/5 dark:bg-secondary/10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-full bg-primary dark:bg-secondary flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-secondary-dark">
                    Generate with AI
                  </span>
                </div>

                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-1.5">
                  Enter your grievance
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="e.g. urgent need for water in the hostel"
                  rows={3}
                  disabled={isPolishing}
                  className="w-full bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-secondary/40 transition-all placeholder:text-text-secondary/50 leading-relaxed disabled:opacity-60"
                />
                <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark mt-1.5 leading-normal">
                  A rough line is enough — title, description, category, and priority will be filled in automatically.
                </p>

                {polishError && (
                  <div className="mt-3 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger dark:text-danger-dark text-xs flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{polishError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={runPolish}
                  disabled={isPolishing}
                  className="w-full mt-4 bg-primary hover:bg-primary-hover dark:bg-secondary dark:hover:bg-secondary-hover text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPolishing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Drafting your complaint...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Complaint
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleFillManually}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark underline cursor-pointer py-1"
              >
                <PenLine className="h-3.5 w-3.5" />
                Fill manually instead
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="manual-pane"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isFilled && (
                <div className="mb-4 flex items-center justify-between gap-3 p-3 rounded-2xl bg-secondary-tint dark:bg-secondary/10 border border-secondary/20 dark:border-secondary/30">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-secondary dark:text-secondary-dark">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>Drafted from your description — review before submitting.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-secondary dark:text-secondary-dark hover:text-secondary-hover dark:hover:text-secondary-dark-hover underline cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Regenerate
                  </button>
                </div>
              )}

              <form onSubmit={handleFileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-1.5">
                    Title of Complaint
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newGrievance.title}
                    onChange={(e) => setNewGrievance({ ...newGrievance, title: e.target.value })}
                    placeholder="e.g. Broken Library AC or Double Exam Fee Charge"
                    required
                    className="w-full bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-secondary/40 transition-all placeholder:text-text-secondary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-1.5">
                    Detailed Description
                  </label>
                  <textarea
                    name="description"
                    value={newGrievance.description}
                    onChange={(e) => setNewGrievance({ ...newGrievance, description: e.target.value })}
                    placeholder="Explain the issues in detail. Mention room numbers, transaction hashes, dates, and names where applicable."
                    required
                    rows={5}
                    className="w-full bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-secondary/40 transition-all placeholder:text-text-secondary/50 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-1.5">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newGrievance.category}
                      onChange={(e) => setNewGrievance({ ...newGrievance, category: e.target.value })}
                      className="w-full bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark mb-1.5">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={newGrievance.priority}
                      onChange={(e) => setNewGrievance({ ...newGrievance, priority: e.target.value })}
                      className="w-full bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
                    >
                      <option value="Low">Low (Convenience/Minor)</option>
                      <option value="Medium">Medium (Operational/Normal)</option>
                      <option value="High">High (Urgent/Hazardous)</option>
                    </select>
                  </div>
                </div>

                {/* Community Switch */}
                <div className="p-4 rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark flex items-center justify-between gap-4 mt-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-1.5">
                      Publish to Student Community Feed
                    </span>
                    <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark leading-normal">
                      Makes the grievance visible to fellow students to upvote, share, and support on the public timeline.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNewGrievance({ ...newGrievance, publishToCommunity: !newGrievance.publishToCommunity })}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer shrink-0 ${newGrievance.publishToCommunity ? 'bg-primary dark:bg-secondary' : 'bg-border dark:bg-border-dark'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${newGrievance.publishToCommunity ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover dark:bg-secondary dark:hover:bg-secondary-hover text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 mt-4 cursor-pointer"
                >
                  {isSubmitting ? 'Registering Complaint...' : 'Register Complaint'}
                </button>

                {!isFilled && (
                  <button
                    type="button"
                    onClick={() => setMode('generate')}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark underline cursor-pointer py-1"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate with AI instead
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}