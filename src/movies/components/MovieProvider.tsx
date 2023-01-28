import { useMoviesReducer } from 'movies/useMoviesReducer';
import React, { useContext } from 'react'

import { Movie, MoviesAction } from 'types';

type MovieContextType = {
    movies: Movie[]
    moviesDispatch: React.Dispatch<MoviesAction>
}

export const MovieContext = React.createContext<MovieContextType | undefined>(undefined);

type MovieProviderProps = {
    children: React.ReactNode
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
    const [{ initialized, movies }, moviesDispatch] = useMoviesReducer();
    return (
        <MovieContext.Provider value={{ movies, moviesDispatch }}>
            { initialized ? children : <div>loading...</div>}
        </MovieContext.Provider>
    )
}

export const useMovies = () => {
    const moviesCtx = useContext(MovieContext);
    if (!moviesCtx) {
        throw new Error("Component beyond MovieContext!")
    }
    return moviesCtx;
}
