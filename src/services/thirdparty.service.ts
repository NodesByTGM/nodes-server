import { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { TrendingMedia } from "../interfaces";
import { mainClient } from "../utilities/axios.client";
import { objectToQueryString } from "../utilities/common";

dotenv.config();
const NEWS_API_KEY = process.env.NEWS_API_KEY
const MOVIEDB_API_KEY = process.env.MOVIEDB_API_KEY

export const getExternalNews = async (query: {
    country?: string
    category?: string
    pageSize?: number
    page?: number
    q?: number
}) => {
    const {
        country = 'ng',
        category = 'entertainment',
        pageSize = 20,
        page = 1,
        q = '',
    } = query
    try {
        const qs = objectToQueryString({ country, category, pageSize, page, q, apiKey: NEWS_API_KEY })
        const result = await mainClient.get(`https://newsapi.org/v2/top-headlines?${qs}`)
        if (result.status === 200) {
            return {
                items: result.data.articles,
                totalItems: result.data.totalResults
            }
        }
    } catch (error) {
        return null
    }
}

// country
// The 2 - letter ISO 3166 - 1 code of the country you want to get headlines for.

// category
// The category you want to get headlines for.
// business entertainment general health science sports technology

// q
// Keywords or a phrase to search for.

// pageSize
// The number of results to return per page(request). 20 is the default, 100 is the maximum.

// page
// Use this to page through the results if the total results found is greater than the page size.


export const getExternalMedia = async () => {

    try {
        const qs = objectToQueryString({ api_key: MOVIEDB_API_KEY, language: 'en-US' })
        const result: AxiosResponse<TrendingMedia> = await mainClient.get(`https://api.themoviedb.org/3/trending/all/day?${qs}`)
        if (result.status === 200) {
            const data = result.data
            return {
                ...data,
                result: undefined,
                currentPage: data.page,
                pageSize: data.results.length,
                totalPages: data.total_pages,
                totalItems: data.total_results,
                items: data.results.map(x => ({
                    ...x,
                    adult: undefined,
                    backdrop_path: `https://image.tmdb.org/t/p${x.backdrop_path}`,
                    poster_path: `https://image.tmdb.org/t/p${x.poster_path}`,
                }))
            }
        }
    } catch (error) {
        return null
    }
}