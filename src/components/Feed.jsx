import React, { useState } from 'react';
import { 
  Image, Video, Heart, MessageCircle, Share2, Plus, 
  Globe, Bookmark, AlertTriangle, Send, MoreHorizontal, Smile, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePosts } from '../context/PostContext';

const Feed = () => {
  const { posts, openCreatePost, addComment } = usePosts();
  const [showReport, setShowReport] = useState(false);

  const stories = [
    { name: 'Your Story', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', isUser: true },
    { name: 'Justin', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150' },
    { name: 'Davis', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { name: 'Randy', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Charlie', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { name: 'Zaire', img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150' },
  ];

  return (
    <div className="flex-1 max-w-[640px] mx-auto px-4 py-6 h-screen overflow-y-auto no-scrollbar bg-[#F8FAFC]">
      
      {/* 1. Refined Circular Stories */}
      <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar py-2">
        {stories.map((story, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.92 }} 
            className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
          >
            <div className="relative">
              <div className={`p-[2.5px] rounded-full transition-transform duration-500 group-hover:rotate-45 ${
                story.isUser ? 'bg-slate-200' : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500'
              }`}>
                <div className="p-[2px] bg-white rounded-full">
                  <img src={story.img} className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform" alt="" />
                </div>
              </div>
              {story.isUser && (
                <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1 border-2 border-white shadow-sm">
                  <Plus className="text-white w-2.5 h-2.5" strokeWidth={3} />
                </div>
              )}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
              {story.name.split(' ')[0]}
            </span>
          </motion.div>
        ))}
      </div>

      {/* 2. Integrated Post Creator */}
      <div 
        onClick={openCreatePost}
        className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 mb-6 group cursor-pointer hover:shadow-md transition-all"
      >
        <div className="flex gap-4 items-center">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" className="w-10 h-10 rounded-full object-cover" alt="" />
          <div className="flex-1 bg-transparent border-none text-sm font-medium text-slate-400">
            Share an update...
          </div>
          <div className="flex gap-1">
            <button className="p-2.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all"><Image size={18} /></button>
            <button className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"><Smile size={18} /></button>
          </div>
        </div>
      </div>

      {/* 3. Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            setShowReport={setShowReport} 
            addComment={addComment}
          />
        ))}
      </div>

      {/* 4. Reporting Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] w-full max-w-[340px] p-8 shadow-2xl border border-white"
            >
              <div className="text-center">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500">
                  <AlertTriangle size={28} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">Report Content</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-6">Select Reason</p>
                
                <div className="space-y-2 mb-8">
                  {['Inappropriate Content', 'Spam', 'Harassment', 'Other'].map(reason => (
                    <button key={reason} className="w-full py-3.5 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-md hover:border-transparent transition-all">
                      {reason}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowReport(false)} className="flex-1 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancel</button>
                  <button className="flex-1 py-4 bg-slate-900 rounded-2xl text-white text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200">Submit</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- Sub Components --- */

const PostCard = ({ post, setShowReport, addComment }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [commentText, setCommentText] = useState('');

  const handleCreateComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCreateComment();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="flex gap-3 items-center">
            <div className="relative">
              <img src={post.author.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-[13px] tracking-tight">{post.author.name}</h4>
              <div className="flex items-center flex-wrap gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                <span>{post.timestamp}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  {post.visibility === 'Campus Only' ? <Users size={10} /> : <Globe size={10} />} 
                  {post.visibility}
                </span>
                {post.category && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md tracking-tight normal-case font-bold">{post.category}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-0.5">
             <button 
              onClick={() => setShowReport(true)}
              className="p-2.5 text-slate-300 hover:text-rose-500 transition-all"
             >
              <AlertTriangle size={18} />
            </button>
            <button className="p-2.5 text-slate-300 hover:bg-slate-50 rounded-xl transition-all"><MoreHorizontal size={18} /></button>
          </div>
        </div>

        <p className="text-slate-600 text-[14px] leading-relaxed mb-5 font-medium px-1 whitespace-pre-wrap">
          {post.content}
        </p>
        
        {post.image && (
          <div className="rounded-[2rem] overflow-hidden max-h-[500px] mb-5 border border-slate-50 relative group bg-slate-50">
            <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-50/50 p-1 rounded-2xl border border-slate-100/50">
            <PostAction 
              active={liked} 
              onClick={() => setLiked(!liked)} 
              icon={<Heart size={18} fill={liked ? "#f43f5e" : "none"} />} 
              count={liked && !post.isLiked ? (parseInt(post.likes) || 0) + 1 : post.likes} 
              color="hover:text-rose-500" 
            />
            <PostAction 
              active={isCommentsOpen} 
              onClick={() => setIsCommentsOpen(!isCommentsOpen)} 
              icon={<MessageCircle size={18} />} 
              count={post.comments?.length || 0}
              color="hover:text-indigo-500" 
            />
            <PostAction icon={<Share2 size={18} />} count={post.shares} color="hover:text-emerald-500" />
          </div>
          <button className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      {/* Improved Dynamic Comment Section */}
      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-50/40 border-t border-slate-100 overflow-hidden"
          >
            <div className="p-6 space-y-5">
              {/* Render dynamic comments */}
              {post.comments && post.comments.length > 0 ? (
                post.comments.map(comment => (
                  <Comment 
                    key={comment.id}
                    user={comment.user} 
                    avatar={comment.avatar}
                    text={comment.text} 
                    time={comment.time} 
                  />
                ))
              ) : (
                <div className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  No comments yet
                </div>
              )}
              
              <div className="flex gap-3 items-center bg-white p-2 pl-4 rounded-[1.5rem] shadow-sm border border-slate-100">
                <input 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a comment..." 
                  className="flex-1 text-xs outline-none font-medium text-slate-600" 
                />
                <button 
                  onClick={handleCreateComment}
                  disabled={!commentText.trim()}
                  className={`
                    p-2.5 rounded-xl text-white shadow-lg transition-all
                    ${commentText.trim() 
                      ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' 
                      : 'bg-slate-300 shadow-none cursor-not-allowed'}
                  `}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PostAction = ({ icon, count, color, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-500 transition-all ${active ? 'bg-white shadow-sm text-indigo-600' : 'hover:bg-white/50 text-slate-400'} ${color}`}
  >
    <span className={active ? 'scale-110 transition-transform' : ''}>{icon}</span>
    <span className="text-[11px] font-black tracking-tight">{count}</span>
  </button>
);

const Comment = ({ user, avatar, text, time }) => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden shadow-inner">
      <img src={avatar || `https://i.pravatar.cc/100?u=${user}`} alt="" />
    </div>
    <div className="flex-1">
      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100/50">
        <p className="text-[12px] text-slate-700 font-medium leading-snug">
          <span className="font-black text-slate-900 mr-2">{user}</span> {text}
        </p>
      </div>
      <div className="flex gap-4 mt-1.5 ml-1">
        <button className="text-[9px] font-black text-slate-300 uppercase hover:text-indigo-600 transition-colors">Like</button>
        <button className="text-[9px] font-black text-slate-300 uppercase hover:text-indigo-600 transition-colors">Reply</button>
        <span className="text-[9px] font-bold text-slate-200 uppercase">{time}</span>
      </div>
    </div>
  </div>
);

export default Feed;