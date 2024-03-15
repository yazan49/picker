import {configureStore} from '@reduxjs/toolkit';
import WatchlistReducer from './WatchlistReducer';
import FavoriteReducer from './FavoriteReducer';

export default configureStore({
  reducer: {
    watchlist: WatchlistReducer,
    favorite: FavoriteReducer,
  },
});
