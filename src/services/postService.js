// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://task-social-app.onrender.com/api';


export const postService = {
  // Get all posts
  getPosts: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/posts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  // Create new post
  createPost: async ({ caption, image }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Ensure we're sending the file with the correct field name
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error creating post');
      }
      return data;
    } catch (error) {
      console.error('Error details:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
    return true;
  }
}; 