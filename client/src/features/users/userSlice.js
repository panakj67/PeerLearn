import { createSlice } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import axios from 'axios'



const initialState = {
    showUserLogin : false,
    isLogin : false,
    points : 0,
    user : null,
}

export const userSlice = createSlice({
    name : 'users',
    initialState,
    reducers : {
        setUser: (state, action) => {
            state.user = action.payload;
            state.notes = action.payload.notes;
            state.points = action.payload.points;
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

export const { showLogin ,hideLogin, setUser, addPoints, userLogin, userLogout, deductPoints } = userSlice.actions;
export default userSlice.reducer;