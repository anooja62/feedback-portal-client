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
export const fetchFeedback = createAsyncThunk(
  'feedback/fetchFeedback',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/all-feedback`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch feedback');
    }
  }
);
export const submitReply = createAsyncThunk(
  'feedback/submitReply',
  async ({ feedbackId, replyText }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/reply`,
        { feedbackId, replyText },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data; // Reply added successfully
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit reply.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
const initialState = {
  loading: false,
  error: null,
  success: null,
  feedbackList: [],
  successMessage: '',
  errorMessage: '',
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
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
        state.feedbackList = [...state.feedbackList, action.payload]; // Append instead of replacing
        state.successMessage = 'Feedback submitted successfully!';
      })
      
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.errorMessage = action.payload || 'Failed to fetch feedback.';
      })
      .addCase(fetchFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.errorMessage = action.payload || 'Failed to fetch feedback.';
      })
      
  
  .addCase(submitReply.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(submitReply.fulfilled, (state, action) => {
    state.loading = false;
    const updatedFeedbackList = state.feedbackList.map((feedback) => {
      if (feedback._id === action.payload.feedback._id) {
        return {
          ...feedback,
          replies: [...feedback.replies, action.payload.reply], 
        };
      }
      return feedback;
    });
    state.feedbackList = updatedFeedbackList;
    state.successMessage = 'Reply submitted successfully!';
  })
  .addCase(submitReply.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.errorMessage = action.payload || 'Failed to submit reply.';
  });
},
});
export const { clearMessages } = feedbackSlice.actions;
export default feedbackSlice.reducer;
