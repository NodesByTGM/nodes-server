import dotenv from "dotenv";
import { mainClient } from "../utilities/axios.client";
import { objectToQueryString } from "../utilities/common";
import { constructResponse } from "./common.service";

dotenv.config();
const API_KEY = process.env.NEWS_API_KEY

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
        const qs = objectToQueryString({ country, category, pageSize, page, q, apiKey: API_KEY })
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