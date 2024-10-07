import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching users from the API
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return response.json();
});

// Users slice
const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentPage: 1,
    itemsPerPage: 5,
    status: "idle",
    error: null,
  },
  reducers: {
    addUser: (state, action) => {
      const newUser = {
        ...action.payload,
        // Generate a unique ID based on existing users
        id:
          state.users.length > 0
            ? Math.max(...state.users.map((user) => user.id)) + 1
            : 1,
      };
      state.users.push(newUser);
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    editUser: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addUser, deleteUser, editUser, setCurrentPage } =
  usersSlice.actions;
export default usersSlice.reducer;
