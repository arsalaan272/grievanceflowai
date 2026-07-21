"use client"
import { X, User, Mail, Building2, GraduationCap, Lock, Eye } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Props:
 * - grievance: the grievance object to show details for (or null — renders nothing)
 * - student: the logged-in student's full parsed profile object (or null)
 * - onClose: () => void
 * - getStatusBadge: (status) => className string
 * - getPriorityBadge: (priority) => JSX/string
 *
 * NOTE: field names below (student?.department, student?.college, student?.rollNo)
 * are best guesses based on what's used elsewhere in this codebase
 * (nameAadhar, email, rollNo, department appear in grievanceController.js populate calls).
 * Check these against your actual Student model and rename if they don't match.
 */
export default function ComplaintDetailsModal({
  grievance,
  student,
  onClose,
  getStatusBadge,
  getPriorityBadge,
}) {
  if (!grievance) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <span className="bg-bg dark:bg-bg-dark text-text-secondary dark:text-text-secondary-dark px-2.5 py-1 rounded-full text-[10px] font-bold border border-border dark:border-border-dark">
              {grievance.category}
            </span>
            {getPriorityBadge(grievance.priority)}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center hover:bg-bg dark:hover:bg-bg-dark transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 text-text-secondary" />
          </button>
        </div>

        {/* Title & description */}
        <h3 className="font-heading font-bold text-lg mt-4">{grievance.title}</h3>
        <p className="text-xs text-text-secondary dark:text-text-secondary-dark leading-relaxed mt-2">
          {grievance.description}
        </p>

        {/* Filer details */}
        <div className="mt-5 pt-4 border-t border-border/80 dark:border-border-dark space-y-2.5">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-text-secondary-dark">
            Filed By
          </h4>

          <div className="flex items-center gap-2 text-xs">
            <User className="h-3.5 w-3.5 text-text-secondary shrink-0" />
            <span className="font-semibold">{student?.nameAadhar || student?.name || 'Unknown Student'}</span>
          </div>

          {student?.email && (
            <div className="flex items-center gap-2 text-xs">
              <Mail className="h-3.5 w-3.5 text-text-secondary shrink-0" />
              <span>{student.email}</span>
            </div>
          )}

          {student?.department && (
            <div className="flex items-center gap-2 text-xs">
              <Building2 className="h-3.5 w-3.5 text-text-secondary shrink-0" />
              <span>{student.department}</span>
            </div>
          )}

          {(student?.college || student?.collegeName) && (
            <div className="flex items-center gap-2 text-xs">
              <GraduationCap className="h-3.5 w-3.5 text-text-secondary shrink-0" />
              <span>{student.college || student.collegeName}</span>
            </div>
          )}
        </div>

        {/* Complaint metadata */}
        <div className="mt-5 pt-4 border-t border-border/80 dark:border-border-dark space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-text-secondary dark:text-text-secondary-dark">Reference Key:</span>
            <span className="font-mono font-bold text-primary dark:text-secondary-dark">{grievance._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary dark:text-text-secondary-dark">Registered Date:</span>
            <span className="font-semibold">{new Date(grievance.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary dark:text-text-secondary-dark">Publish Visibility:</span>
            <span className="font-semibold flex items-center gap-1">
              {grievance.publishToCommunity ? (
                <><Eye className="h-3.5 w-3.5 text-success" /> Public on Feed</>
              ) : (
                <><Lock className="h-3.5 w-3.5 text-text-secondary" /> Private to Staff</>
              )}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}