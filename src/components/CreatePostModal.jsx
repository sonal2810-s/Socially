import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Globe, Lock, Users, ChevronDown, Loader2, AlertCircle, Briefcase, Calendar, Megaphone, FileText } from 'lucide-react';
import { usePosts } from '../context/PostContext';

// Verification Constants
const MIN_CONTENT_LENGTH = 10;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'video/mp4'];

const CreatePostModal = () => {
  const { isModalOpen, closeCreatePost, addPost } = usePosts();
  
  // Form State
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [mediaFile, setMediaFile] = useState(null); // Validated file object
  
  // Settings State
  const [visibility, setVisibility] = useState('Campus Only'); // Default: Campus Only
  const [category, setCategory] = useState('General Update'); // Default: General
  
  // UI State
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const textareaRef = useRef(null);

  // Focus and Reset
  useEffect(() => {
    if (isModalOpen) {
      if (textareaRef.current) textareaRef.current.focus();
      // Reset state on open
      setContent('');
      setImage(null);
      setMediaFile(null);
      setVisibility('Campus Only');
      setCategory('General Update');
      setError('');
    }
  }, [isModalOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeCreatePost();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeCreatePost]);

  // -------------------------------------------------
  // 3. MEDIA VALIDATION
  // -------------------------------------------------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    // Type Validation
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or MP4.');
      return;
    }

    // Size Validation
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setMediaFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // -------------------------------------------------
  // 7. CONTENT SAFETY (Client-Side Check)
  // -------------------------------------------------
  const checkForSimulatedSafety = (text) => {
    const forbidden = ['spam', 'crypto_scam'];
    for (const word of forbidden) {
      if (text.toLowerCase().includes(word)) {
        throw new Error('Post contains forbidden keywords (simulated safety check).');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. AUTHENTICATION CHECK (Simulated)
    // In a real app, check context.user or token
    const isAuthenticated = true; 
    if (!isAuthenticated) {
      setError('You must be logged in to post.');
      return;
    }

    // 2. CONTENT VALIDATION
    if (!content.trim() || content.trim().length < MIN_CONTENT_LENGTH) {
      setError(`Post content must be at least ${MIN_CONTENT_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 7. CONTENT SAFETY CHECK
      checkForSimulatedSafety(content);

      // Simulate Backend Latency & 6. RATE LIMITING
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Randomly simulate a rate limit error for demonstration
          // if (Math.random() > 0.9) reject(new Error('Rate limit exceeded. Please wait.'));
          resolve();
        }, 800);
      });

      addPost({
        author: {
          name: 'CurrentUser', 
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        },
        content,
        image,
        visibility,
        category, // 5. POST TYPE
      });

      closeCreatePost();

    } catch (err) {
      setError(err.message || 'Failed to post. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  const isValid = content.trim().length >= MIN_CONTENT_LENGTH;

  const categories = [
    { label: 'General Update', icon: FileText, color: 'text-slate-500' },
    { label: 'Career Guidance', icon: Briefcase, color: 'text-indigo-500' },
    { label: 'Opportunity', icon: Megaphone, color: 'text-emerald-500' },
    { label: 'Event', icon: Calendar, color: 'text-rose-500' },
  ];

  const currentCategory = categories.find(c => c.label === category) || categories[0];

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCreatePost}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h2 className="text-lg font-bold text-slate-800">Create Post</h2>
              <button 
                onClick={closeCreatePost}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                className="bg-rose-50 px-6 py-3 border-b border-rose-100 flex items-center gap-2 text-rose-600 text-xs font-bold"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex gap-3 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" 
                  alt="Current User" 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-50"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">CurrentUser</h3>
                  
                  {/* Selectors Row */}
                  <div className="flex gap-2">
                    {/* Visibility Selector */}
                    <div className="relative">
                      <button 
                        onClick={() => { setShowVisibilityMenu(!showVisibilityMenu); setShowCategoryMenu(false); }}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                      >
                        {visibility === 'Public' && <Globe size={10} />}
                        {visibility === 'Campus Only' && <Users size={10} />}
                        {visibility}
                        <ChevronDown size={10} />
                      </button>

                      <AnimatePresence>
                        {showVisibilityMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 overflow-hidden"
                          >
                            {['Public', 'Campus Only'].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => {
                                  setVisibility(opt);
                                  setShowVisibilityMenu(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-[11px] font-bold flex items-center gap-2 transition-colors ${visibility === opt ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                              >
                                {opt === 'Public' ? <Globe size={14} /> : <Users size={14} />}
                                {opt}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Category Selector */}
                    <div className="relative">
                      <button 
                        onClick={() => { setShowCategoryMenu(!showCategoryMenu); setShowVisibilityMenu(false); }}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                      >
                        <currentCategory.icon size={10} className={currentCategory.color} />
                        {category}
                        <ChevronDown size={10} />
                      </button>

                      <AnimatePresence>
                        {showCategoryMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 overflow-hidden"
                          >
                            {categories.map((cat) => (
                              <button
                                key={cat.label}
                                onClick={() => {
                                  setCategory(cat.label);
                                  setShowCategoryMenu(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-[11px] font-bold flex items-center gap-2 transition-colors ${category === cat.label ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                              >
                                <cat.icon size={14} className={category === cat.label ? 'text-indigo-600' : cat.color} />
                                {cat.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts... (min 10 chars)"
                className="w-full h-32 text-base text-slate-700 placeholder:text-slate-300 border-none outline-none resize-none bg-transparent"
              />

              {image && (
                <div className="relative mb-4 rounded-xl overflow-hidden group border border-slate-100">
                  <img src={image} alt="Preview" className="w-full max-h-[300px] object-cover" />
                  <button 
                    onClick={() => { setImage(null); setMediaFile(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                  <label className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors" title="Attach Image or Video">
                    <input type="file" accept="image/png,image/jpeg,video/mp4" className="hidden" onChange={handleImageUpload} />
                    <Image size={22} />
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-bold transition-colors ${content.length > 0 && content.length < MIN_CONTENT_LENGTH ? 'text-orange-500' : 'text-slate-300'}`}>
                      {content.length > 0 && content.length < MIN_CONTENT_LENGTH ? `${MIN_CONTENT_LENGTH - content.length} more` : `${content.length}/500`}
                    </span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                    className={`
                      px-6 py-2.5 rounded-xl text-sm font-black text-white transition-all transform flex items-center gap-2
                      ${(!isValid || isSubmitting) 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
