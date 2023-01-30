import React, { useReducer, useEffect } from "react";
import { v4 as uuid } from "uuid";

import { Movie, MoviesAction } from "types";
import { getMovies } from "api/movies";

interface MoviesState {
  movies: Movie[];
  initialized: boolean;
}

export function useMoviesReducer(): [
  MoviesState,
  React.Dispatch<MoviesAction>
] {
  const movieReducer = (
    state: MoviesState,
    action: MoviesAction
  ): MoviesState => {
    switch (action.type) {
      case "fetch":
        return { ...state, movies: action.payload.data };

      case "add":
        return {
          ...state,
          movies: [
            ...state.movies,
            { id: uuid(), ratings: [], ...action.payload.movie },
          ],
        };

      case "delete":
        return {
          ...state,
          movies: state.movies.filter(
            (movie) => movie.id !== action.payload.movieId
          ),
        };

      case "rate":
        return {
          ...state,
          movies: state.movies.map((movie) =>
            movie.id === action.payload.movieId
              ? { ...movie, ratings: [...movie.ratings, action.payload.rating] }
              : movie
          ),
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(movieReducer, {
    movies: [],
    initialized: false,
  });

  useEffect(() => {
    getMovies().then((movies) => {
      dispatch({ type: "fetch", payload: { data: movies } });
    });
  }, []);

  return [state, dispatch];
}
