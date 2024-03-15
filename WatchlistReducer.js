import {createSlice} from '@reduxjs/toolkit';

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    watchlist: [],
  },
  reducers: {
    addToWatchlist: (state, action) => {
      const itemInWatchlist = state.watchlist.find(
        item => item.id == action.payload.id,
      );
      if (itemInWatchlist) {
        console.log('Item Already in WatchList');
      } else {
        state.watchlist.push({...action.payload});
      }
    },
    removeFromWatchlist: (state, action) => {
      const removeFromWatchlist = state.watchlist.filter(
        item => item.id !== action.payload.id,
      );
      state.watchlist = removeFromWatchlist;
    },
  },
});
export const {addToWatchlist, removeFromWatchlist} = watchlistSlice.actions;

export default watchlistSlice.reducer;
