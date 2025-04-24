import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const submitFeedback = createAsyncThunk(
  'feedback/submitFeedback',
  async (feedbackData, thunkAPI) => {
console.log('✌️feedbackData --->', feedbackData);
console.log('token', `Bearer ${localStorage.getItem('token')}`);
    try {
      const response = await axios.post(`${API_URL}/api/feedback`, feedbackData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include token

        },
      });

      return response.data; // Successful submission
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    // Optionally clear any feedback state
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.successMessage = 'Feedback submitted successfully!';
        
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feedbackSlice.reducer;
