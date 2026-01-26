
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './pages/Feed';
import { PostProvider } from './context/PostContext';
import CreatePostModal from './components/CreatePostModal';

function App() {
  return (
    <PostProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Placeholder routes for others using Feed for now until created */}
          <Route path="/network" element={<Feed />} />
          <Route path="/jobs" element={<Feed />} />
          <Route path="/messages" element={<Feed />} />
          <Route path="/notifications" element={<Feed />} />
          <Route path="/profile" element={<Feed />} />
        </Routes>
        <CreatePostModal />
      </Router>
    </PostProvider>
  );
}

export default App;
