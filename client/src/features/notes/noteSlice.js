import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchTerm : "",
    notes : [],
}

export const noteSlice = createSlice({
    name : "notes",
    initialState,
    reducers : {
        setSearch : (state, action) => {
            state.searchTerm = action.payload
            
        },
        fetchNotes : (state, action) => {
            state.notes = action.payload
        },
        addNotes : (state, action) => {
            state.notes.push(action.payload)
        }
    }
})

export const { setSearch, fetchNotes, addNotes } = noteSlice.actions;
export default noteSlice.reducer;