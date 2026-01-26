import React, { useState } from 'react';
import { 
  Search, Bell, ChevronDown, Grid, Layout, Command, 
  Compass, Users, Briefcase, PlusCircle, MessageCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePosts } from '../context/PostContext';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Explore');
  const { openCreatePost } = usePosts();

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-2.5">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-8">
        
        {/* 1. Brand Logo - Minimal & Bold */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-slate-900 p-2 rounded-xl">
              <Layout className="text-white w-5 h-5" />
            </div>
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tighter hidden xl:block">
            WeShare
          </span>
        </div>

        {/* 2. Central Navigation - Fills the "Empty" space */}
        <div className="hidden lg:flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-100">
          <TabItem 
            icon={<Compass size={18} />} 
            label="Explore" 
            active={activeTab === 'Explore'} 
            onClick={() => setActiveTab('Explore')} 
          />
          <TabItem 
            icon={<Users size={18} />} 
            label="Communities" 
            active={activeTab === 'Communities'} 
            onClick={() => setActiveTab('Communities')} 
          />
          <TabItem 
            icon={<Briefcase size={18} />} 
            label="Collaborate" 
            active={activeTab === 'Collaborate'} 
            onClick={() => setActiveTab('Collaborate')} 
          />
        </div>

        {/* 3. Search & Actions Container */}
        <div className="flex-1 flex items-center justify-end gap-4">
          
          {/* Dynamic Search Bar */}
          <div className="hidden md:flex items-center bg-slate-50 px-4 py-2 rounded-xl w-full max-w-[280px] border border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all group">
            <Search className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-indigo-500" />
            <input 
              type="text" 
              placeholder="Search campus..." 
              className="bg-transparent border-none outline-none text-xs w-full font-medium text-slate-600 placeholder:text-slate-400"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <NavAction icon={<PlusCircle size={20} />} label="New Post" hideLabel onClick={openCreatePost} />
            <NavAction icon={<MessageCircle size={20} />} badge="3" />
            <NavAction icon={<Bell size={20} />} badge="!" />
          </div>

          {/* Profile - Sleeker & More Integrated */}
          <div className="flex items-center gap-2 pl-4 border-l border-slate-100 ml-2 cursor-pointer group">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" 
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all"
                alt="Profile"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 border-2 border-white rounded-full" />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>

      </div>
    </nav>
  );
};

/* --- Refined Internal Components --- */

const TabItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
      active 
        ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200' 
        : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon}
    <span className={active ? 'block' : 'hidden xl:block'}>{label}</span>
  </button>
);

const NavAction = ({ icon, badge, label, hideLabel, onClick }) => (
  <motion.button 
    onClick={onClick} 
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.9 }}
    className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all relative flex items-center gap-2"
  >
    {icon}
    {!hideLabel && label && <span className="text-xs font-bold">{label}</span>}
    {badge && (
      <span className="absolute top-2 right-2 min-w-[14px] h-[14px] bg-rose-500 text-[8px] font-black text-white flex items-center justify-center rounded-full border-2 border-white">
        {badge}
      </span>
    )}
  </motion.button>
);

export default Navbar;