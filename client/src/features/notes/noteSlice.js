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
            state.notes = action.payload;
        },
        addNotes : (state, action) => {
            state.notes.push(action.payload)
        },
        updateThumb : (state, action) => {
            state.notes = state.notes.map((note) => {
                return note._id === action.payload.id ? action.payload.note : note;
            })
        },
        deleteNotes : (state, action) => {
            state.notes = state.notes.filter((note) => note._id !== action.payload);
        }
    }
})

export const { setSearch, fetchNotes, updateThumb, deleteNotes, addNotes } = noteSlice.actions;
export default noteSlice.reducer;