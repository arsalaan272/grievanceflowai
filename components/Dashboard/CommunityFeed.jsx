"use client"
import { useState, useEffect } from 'react';
import { Building2, ThumbsUp, MessageSquare, Send, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Self-contained: fetches its own data from GET /api/grievances/community
 * (every student's publishToCommunity:true posts) rather than relying on
 * the parent dashboard to fetch and pass it down. Upvoting and commenting
 * are also handled locally here, with optimistic UI updates synced to the
 * backend in the background.
 *
 * Props:
 * - setActiveTab: (tab: string) => void  (used by the "publish your own" empty-state button)
 */
export default function CommunityFeed({ setActiveTab }) {
  const [communityGrievances, setCommunityGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [newCommentText, setNewCommentText] = useState({});

  // Load the current student's email (for the upvote-check) + the community feed itself
  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      try {
        const parsed = JSON.parse(storedStudent);
        setStudentEmail(parsed.email || '');
      } catch (e) {
        // use default
      }
    }

    loadCommunityFeed();
  }, []);

  const loadCommunityFeed = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grievances/community`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Unable to load the community feed.');
        setCommunityGrievances([]);
        return;
      }

      setCommunityGrievances(data);
    } catch (err) {
      setError('Could not connect to the server. Please try again shortly.');
      setCommunityGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  // Upvote complaint in Community Feed
  const handleUpvote = async (id) => {
    const token = localStorage.getItem('token');
    const target = communityGrievances.find(g => g._id === id);
    if (!target) return;

    const alreadyUpvoted = target.upvotes?.includes(studentEmail);
    const optimisticUpvotes = alreadyUpvoted
      ? target.upvotes.filter(email => email !== studentEmail)
      : [...(target.upvotes || []), studentEmail];

    setCommunityGrievances(communityGrievances.map(g => g._id === id ? { ...g, upvotes: optimisticUpvotes } : g));

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
      author: studentEmail,
      content: text.trim(),
      createdAt: new Date().toISOString()
    };

    setCommunityGrievances(communityGrievances.map(g => g._id === id ? { ...g, comments: [...(g.comments || []), newComment] } : g));
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

  return (
    <motion.div
      key="feed-pane"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Header Info */}
      <div className="rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] p-6">
        <h3 className="font-heading font-bold text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" /> Campus Grievance Discussion Feed
        </h3>
        <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1 leading-relaxed">
          This public space hosts grievance items published to the community by college students. Upvote complaints to elevate visibility for student union and senate review, or suggest helpful hints in the comments!
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger dark:text-danger-dark text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-text-secondary dark:text-text-secondary-dark">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading community feed...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {communityGrievances.map((item) => {
            const alreadyUpvoted = item.upvotes?.includes(studentEmail);
            return (
              <div
                key={item._id}
                className="rounded-3xl border border-border dark:border-white/10 bg-surface dark:bg-[#16161B] p-6 space-y-4 hover:border-primary/20 dark:hover:border-white/20 transition-all duration-200"
              >
                {/* Author info & date */}
                <div className="flex items-center justify-between border-b border-border/60 dark:border-border-dark/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-primary/10 dark:bg-secondary-dark/15 text-primary dark:text-secondary-dark flex items-center justify-center font-bold text-xs uppercase">
                      S
                    </div>
                    <div>
                      <p className="text-[11px] font-bold">Verified Student Member</p>
                      <p className="text-[9px] text-text-secondary/70 dark:text-text-secondary-dark/70">
                        {new Date(item.createdAt).toLocaleDateString()} · Campus Network
                      </p>
                    </div>
                  </div>

                  <span className="bg-bg dark:bg-bg-dark text-text-secondary dark:text-text-secondary-dark px-2 py-0.5 rounded-full text-[9px] font-bold border border-border dark:border-border-dark">
                    {item.category}
                  </span>
                </div>

                {/* Title & Body */}
                <div>
                  <h4 className="font-heading font-bold text-base">{item.title}</h4>
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>

                {/* Upvotes & comment actions panel */}
                <div className="flex items-center gap-4 pt-2 border-t border-border/40 dark:border-border-dark/40">

                  {/* Upvote button */}
                  <button
                    onClick={() => handleUpvote(item._id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                      alreadyUpvoted
                        ? 'bg-primary text-white scale-105'
                        : 'bg-bg dark:bg-bg-dark text-text-secondary dark:text-text-secondary-dark hover:bg-border/60 dark:hover:bg-border-dark/60'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Upvote ({item.upvotes?.length || 0})</span>
                  </button>

                  {/* Comment trigger indicator */}
                  <div className="flex items-center gap-1 text-xs font-semibold text-text-secondary dark:text-text-secondary-dark">
                    <MessageSquare className="h-4 w-4" />
                    <span>{item.comments?.length || 0} Suggestion(s)</span>
                  </div>

                </div>

                {/* Nest Comments list & add new suggestion box */}
                <div className="bg-bg/60 dark:bg-bg-dark/40 p-4 rounded-2xl border border-border/80 dark:border-border-dark space-y-4">
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                    Student Suggestions & Timeline Notes
                  </h5>

                  {/* Comments List */}
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {item.comments?.map((comment) => (
                      <div key={comment._id} className="text-xs leading-relaxed">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] text-primary dark:text-secondary-dark">
                            {comment.author}
                          </span>
                          <span className="text-[9px] text-text-secondary/70">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-text-secondary dark:text-text-secondary-dark mt-0.5 pl-2 border-l border-border dark:border-border-dark">
                          {comment.content}
                        </p>
                      </div>
                    ))}

                    {(!item.comments || item.comments.length === 0) && (
                      <p className="text-[11px] text-text-secondary/60 italic">
                        No community hints submitted yet. Write a recommendation below!
                      </p>
                    )}
                  </div>

                  {/* Add comment input form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCommentText[item._id] || ''}
                      onChange={(e) => setNewCommentText({ ...newCommentText, [item._id]: e.target.value })}
                      placeholder="Type a helpful comment or support reply..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(item._id);
                      }}
                      className="w-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleAddComment(item._id)}
                      className="bg-primary dark:bg-secondary hover:opacity-90 text-white h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform cursor-pointer"
                      aria-label="Send comment"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}

          {communityGrievances.length === 0 && (
            <div className="text-center py-12 bg-surface dark:bg-[#16161B] border border-dashed border-border dark:border-border-dark rounded-3xl">
              <p className="text-sm text-text-secondary">No public community complaints are published yet.</p>
              <button
                onClick={() => setActiveTab('file')}
                className="mt-3 text-xs font-bold text-primary underline"
              >
                Publish your own complaint to community
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}