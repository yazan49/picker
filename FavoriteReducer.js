import {createSlice} from '@reduxjs/toolkit';

export const favoriteActorsSlice = createSlice({
  name: 'favorite',
  initialState: {
    favorite: [],
  },
  reducers: {
    addToFavoriteActors: (state, action) => {
      const itemInFavorites = state.favorite.find(
        item => item.id === action.payload.id,
      );
      if (itemInFavorites) {
        console.log('Item Already in listttt');
      } else {
        state.favorite.push({...action.payload});
      }
    },
    removeFromFavoriteActors: (state, action) => {
      const removeFromFavorites = state.favorite.filter(
        item => item.id !== action.payload.id,
      );
      state.favorite = removeFromFavorites;
    },
  },
});

export const {addToFavoriteActors, removeFromFavoriteActors} =
  favoriteActorsSlice.actions;

export default favoriteActorsSlice.reducer;
