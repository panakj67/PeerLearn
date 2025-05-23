import { createSlice } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import axios from 'axios'



const initialState = {
    showUserLogin : false,
    isLogin : false,
    points : 0,
    user : null,
    downloads : [],
    uploads : [],
    AiVisible : false,
    chatVisible : false,
    messages : []
}

export const userSlice = createSlice({
    name : 'users',
    initialState,
    reducers : {
        setUser: (state, action) => {
            state.user = action.payload;
            state.points = action.payload.points;
            state.downloads = action.payload.downloads || [];
            state.uploads = action.payload.uploads || [];
            state.messages = action.payload.messages || [];
        },

        setMessages: (state, action) => { 
            state.messages.push(action.payload);
        },   
        clearMessages: (state) => {
            state.messages = [];
        }, 

        toggleAiVisible: (state) => {
            state.AiVisible = !state.AiVisible;
        },
        toggleChatVisible: (state) => {
            state.chatVisible = !state.chatVisible;
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

export const { showLogin ,hideLogin, setUser,
    addUploads, addDownloads, addPoints, removeFromUploads, clearMessages, userLogin,toggleAiVisible, toggleChatVisible, setMessages, userLogout, deductPoints } = userSlice.actions;
export default userSlice.reducer;