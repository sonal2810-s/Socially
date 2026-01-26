import React, { createContext, useContext, useEffect, useState } from 'react';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/posts/feed', {
        headers: getAuthHeaders()
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error("Unauthorized - Please login");
        }
        return;
      }

      const responseData = await res.json();
      setPosts(responseData.data || []); 
    } catch (err) {
      console.error("Failed to fetch feed:", err);
      setPosts([]);
    }
  };

  const createPost = async (payload) => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload)
    });
    fetchFeed();
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <PostContext.Provider value={{ posts, createPost }}>
      {children}
    </PostContext.Provider>
  );
};
