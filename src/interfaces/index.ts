import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface Quote {
    anime: string;
    character: string;
    quote: string;
}
export interface QuotesQueryMap {
    filterType?: string;
    title?: string;
    name?: string;
    page?: number;
    pageSize?: number;
    fetchNew?: boolean;
}

export interface StringMap {
    [key: string]: any
}


interface User {
    id: string;
    username: string;
    [rest: string]: any
    // Add other user-related fields as needed
}

// Extend the existing Request type to include a user property
export interface RequestWithUser extends Request {
    user?: User;
}

// Define a modified RequestHandler type that accepts a RequestWithUser
export interface CustomRequestHandler extends RequestHandler {
    (req: RequestWithUser, res: Response, next: NextFunction): void;
};

export interface TrendingMedia {
    page: number;
    results: Result[];
    total_pages: number;
    total_results: number;
}

interface Result {
    backdrop_path: string;
    id: number;
    original_name?: string;
    overview: string;
    poster_path: string;
    media_type: string;
    adult: boolean;
    name?: string;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
    origin_country?: string[];
    original_title?: string;
    title?: string;
    release_date?: string;
    video?: boolean;
}

export interface MoviePerson {
    page: number;
    results: MoviePersonResult[];
    total_pages: number;
    total_results: number;
}

interface MoviePersonResult {
    id: number;
    original_name: string;
    media_type: string;
    adult: boolean;
    name: string;
    popularity: number;
    gender: number;
    known_for_department: string;
    profile_path: string;
    known_for: Knownfor[];
}

interface Knownfor {
    backdrop_path: string;
    id: number;
    original_name?: string;
    overview: string;
    poster_path: string;
    media_type: string;
    adult: boolean;
    name?: string;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
    origin_country?: string[];
    original_title?: string;
    title?: string;
    release_date?: string;
    video?: boolean;
}