import React, { useState, useEffect } from 'react';
import './Feed.css';
import Navbar from '../../components/common/Navbar/Navbar';
import { postService } from '../../services/postService';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ caption: '', image: null });
  const [showPostForm, setShowPostForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await postService.getPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
        setError('Please upload only JPG, PNG or GIF images');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setNewPost({ ...newPost, image: file });
      setImagePreview(URL.createObjectURL(file));
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.image || !newPost.caption.trim()) {
      setError('Please provide both image and caption');
      return;
    }

    try {
      setError(''); // Clear any previous errors
      const createdPost = await postService.createPost({
        caption: newPost.caption,
        image: newPost.image
      });
      
      setPosts([createdPost, ...posts]);
      
      // Reset form
      setNewPost({ caption: '', image: null });
      setImagePreview(null);
      setShowPostForm(false);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Error creating post. Please try again.');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="feed-container">
        <div>Loading posts...</div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="feed-container">
        <div className="feed-header">
          <h2>Feed</h2>
          <button 
            className="create-post-btn"
            onClick={() => setShowPostForm(true)}
          >
            Create Post
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showPostForm && (
          <div className="modal-overlay">
            <div className="post-form">
              <h3>Create New Post</h3>
              <form onSubmit={handleSubmit}>
                <div className="image-upload-container">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button 
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          setImagePreview(null);
                          setNewPost({ ...newPost, image: null });
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleImageChange}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <span>Click to upload image</span>
                      </label>
                    </div>
                  )}
                </div>
                <textarea
                  placeholder="Write a caption..."
                  value={newPost.caption}
                  onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
                  required
                />
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowPostForm(false);
                      setImagePreview(null);
                      setNewPost({ caption: '', image: null });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="post-btn"
                    disabled={!newPost.image || !newPost.caption.trim()}
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="posts-container">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="user-info">
                  <div className="avatar">
                    {post.user.name[0]}
                  </div>
                  <span className="username">{post.user.name}</span>
                </div>
                <span className="timestamp">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="post-image">
                <img src={post.imageUrl} alt="Post" />
              </div>
              <div className="post-content">
                <p className="caption">
                  <span className="username">{post.user.name}</span> {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Feed; 