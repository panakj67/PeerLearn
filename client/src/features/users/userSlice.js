import { createSlice } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import axios from 'axios'
import { Bookmark } from 'lucide-react'



const initialState = {
    showUserLogin : false,
    isLogin : false,
    points : 0,
    user : null,
    downloads : [],
    uploads : [],
    visible : false,
    chatVisible : false,
    messages : [],
    loading : true,
    bookmarks : []
}

export const userSlice = createSlice({
    name : 'users',
    initialState,
    reducers : {
        setUser: (state, action) => {
            state.user = action.payload;
            state.points = action.payload.points;
            state.downloads = action.payload.downloads || [];
            state.bookmarks = action.payload.bookmarks || [];
            state.uploads = action.payload.uploads || [];
            state.messages = action.payload.messages || [];
        },

        setLoading : (state, action) => {
            state.loading = action.payload;
        },

        addToBookmark : (state, action) => {
            state.bookmarks.push(action.payload)
        },

        removeFromBookmark : (state, action) => {
            state.bookmarks = state.bookmarks.filter((note) => note._id !== action.payload)
        },

        setMessages: (state, action) => { 
            state.messages.push(action.payload);
        },   
        clearMessages: (state) => {
            state.messages = [];
        }, 

        toggleVisible: (state) => {
            state.visible = !state.visible;
        },

        toggleChatVisible: (state, action) => {
            state.chatVisible = action.payload;
        },

        addUploads: (state, action) => {
            state.uploads.push(action.payload);
        },
        addDownloads: (state, action) => {
            state.downloads.push(action.payload);
        },

        removeFromUploads : (state, action) => {
            state.uploads = state.uploads.filter((note) => note._id !== action.payload);
        },
        
        showLogin : (state) => {
            state.showUserLogin = true;
        },
        hideLogin : (state) => {
            state.showUserLogin = false;
        },
        userLogin : (state) => {
            state.isLogin = true;
        },
        userLogout : (state) => {
            state.user = null;
        },
        deductPoints : (state, action) => {
            if(state.user){
                state.points -= action.payload
            }
        },
       
          addPoints: (state, action) => {
            state.points += action.payload;
          },
    }
})

export const { showLogin ,hideLogin, setUser, setLoading,
    addToBookmark, removeFromBookmark,
    addUploads, addDownloads, addPoints, removeFromUploads, clearMessages, userLogin,toggleVisible,
    toggleChatVisible, setMessages, userLogout, deductPoints } = userSlice.actions;
export default userSlice.reducer;