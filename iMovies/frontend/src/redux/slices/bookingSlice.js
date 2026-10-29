import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createReservation = createAsyncThunk(
  'bookings/createReservation',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create seat reservation'
      );
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async (status = '', { rejectWithValue }) => {
    try {
      const query = status ? `?status=${status}` : '';
      const response = await api.get(`/bookings/my${query}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch your bookings'
      );
    }
  }
);

export const cancelUserBooking = createAsyncThunk(
  'bookings/cancelUserBooking',
  async ({ bookingId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to cancel booking'
      );
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    activeBooking: null,
    bookingsList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearActiveBooking: (state) => {
      state.activeBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.activeBooking = action.payload;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingsList = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelUserBooking.fulfilled, (state, action) => {
        state.bookingsList = state.bookingsList.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      });
  },
});

export const { clearActiveBooking } = bookingSlice.actions;
export default bookingSlice.reducer;

