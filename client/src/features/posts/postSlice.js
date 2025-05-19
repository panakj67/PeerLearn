import { createSlice } from '@reduxjs/toolkit'

const initialState = [
        {
            id: 1,
            title: "First Post",
            content: "This is the content of the first post.",
            author: "John Doe",
            date: "2023-10-01",
            likes: 10,
            comments: []
        },
        {
            id: 2,
            title: "Second Post",
            content: "This is the content of the second post.",
            author: "Jane Smith",
            date: "2023-10-02",
            likes: 20,
            comments: []
        }
]


export const postSlice = createSlice({
    name : "posts",
    initialState,
    reducers : {
        addPost : (state, action) => {
            state.push(action.payload)
        },
        deletePost : (state, action) => {
            const idx = state.findIndex(post => post.id === action.payload);
            state.splice(idx, 1)
        }
    }
})

export const { addPost, deletePost } = postSlice.actions
export default postSlice.reducer