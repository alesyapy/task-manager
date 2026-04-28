import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  currentBoard: null,
  loading: false,
  error: "",
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards(state, action) {
      state.items = action.payload;
    },

    addBoard(state, action) {
      state.items.push(action.payload);
    },

    updateBoard(state, action) {
      const updatedBoard = action.payload;

      state.items = state.items.map((board) =>
        board.id === updatedBoard.id ? updatedBoard : board
      );
    },

    removeBoard(state, action) {
      state.items = state.items.filter((board) => board.id !== action.payload);
    },

    setCurrentBoard(state, action) {
      state.currentBoard = action.payload;
    },

    clearCurrentBoard(state) {
      state.currentBoard = null;
    },

    setBoardsLoading(state, action) {
      state.loading = action.payload;
    },

    setBoardsError(state, action) {
      state.error = action.payload;
    },

    clearBoards(state) {
      state.items = [];
      state.currentBoard = null;
      state.loading = false;
      state.error = "";
    },
  },
});

export const {
  setBoards,
  addBoard,
  updateBoard,
  removeBoard,
  setCurrentBoard,
  clearCurrentBoard,
  setBoardsLoading,
  setBoardsError,
  clearBoards,
} = boardsSlice.actions;

export default boardsSlice.reducer;