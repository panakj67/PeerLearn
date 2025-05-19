import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PostForm from './PostForm'
import { deletePost } from './postSlice'

const Post = () => {
    const posts = useSelector((state) => state.post)
    const dispatch = useDispatch()
    const deleteHandler = (id_) => {
        dispatch(deletePost(id_))
    }
    return (
            <div className="w-70 mt-10">
                <h1>Posts : </h1>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="border border-gray-300 p-4 m-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600">{post.content}</p>
                        <button
                         onClick={() => deleteHandler(post.id)}
                         className='px-2 py-1 bg-orange-500 cursor-pointer rounded text-amber-50'>delete</button>
                    </div>
                ))}
            </div>
    )
}

export default Post