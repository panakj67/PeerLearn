import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPost } from './postSlice';

const PostForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [id, setId] = useState(2)

    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && content) {
            setId(id + 1);
            dispatch(addPost({ id, title, content }));
            setTitle('');
            setContent('');
        }
    };



    return (
       <div className="post-form bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8 rounded-lg shadow-lg text-white">
    <h2 className="text-2xl font-bold mb-6 text-center">Create New Post</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-black"
            />
        </div>
        <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">Content</label>
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter post content"
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-black"
            />
        </div>
        <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition duration-300"
        >
            Create Post
        </button>
    </form>
</div>
    );
};

export default PostForm;