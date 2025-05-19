import { configureStore } from '@reduxjs/toolkit'
import postReducer from '../features/posts/postSlice'
import userReducer from '../features/users/userSlice'
import noteReducer from '../features/notes/noteSlice'

export const store = configureStore({
    reducer : {
        post : postReducer,
        user : userReducer,
        note : noteReducer
    }
})