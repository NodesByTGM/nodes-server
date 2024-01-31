import { Quote, QuotesQueryMap } from '../interfaces';
import { QuoteModel } from "../mongodb/models";
import { mainClient } from "../utilities/axios.client";
import { objectToQueryString } from "../utilities/common";
import { AppConfig } from "../utilities/config";

export const getQuotesFromExternal = async (queryMap: QuotesQueryMap) => {
    const filterType = queryMap.filterType
    const queryString = objectToQueryString(queryMap)
    if (filterType === 'anime') {
        return await mainClient.get(`${AppConfig.API_ENDPOINTS.EXTERNAL.Quotes.AnimeTitle}?${queryString}`)
    } else if (filterType === 'character') {
        return await mainClient.get(`${AppConfig.API_ENDPOINTS.EXTERNAL.Quotes.Character}?${queryString}`)
    }
    return await mainClient.get(`${AppConfig.API_ENDPOINTS.EXTERNAL.Quotes.Base}`)
}

export const getQuotesFromDB = async (queryMap: QuotesQueryMap) => {
    const { title = "", name = "", page = 1, pageSize = AppConfig.DEFAULT_PAGE_SIZE } = queryMap
    let result: any
    const skip = (page - 1) * pageSize;

    if (title) {
        result = await QuoteModel.find({
            anime: { $regex: title, $options: 'i' },
        }).skip(skip).limit(pageSize);

    } else if (name) {
        result = await QuoteModel.find({
            character: { $regex: name, $options: 'i' }
        }).skip(skip).limit(pageSize);

    } else {
        result = await QuoteModel.find({}).skip(skip).limit(pageSize);
    }
    const total = await QuoteModel.countDocuments()
    // const total = result?.length
    return { quotes: result, total, page, pageSize }
}

export const getSingleQuoteFromDB = async (id: string) => {
    const result = await QuoteModel.findOne({ _id: id });
    return { quote: result }
}


export const getRandomFromExternal = async (queryMap: QuotesQueryMap) => {
    const filterType = queryMap.filterType
    const queryString = objectToQueryString(queryMap)
    if (filterType === 'anime') {
        return await mainClient.get(`${AppConfig.API_ENDPOINTS.EXTERNAL.Random.AnimeTitle}?${queryString}`)
    } else if (filterType === 'character') {
        return await mainClient.get(`${AppConfig.API_ENDPOINTS.EXTERNAL.Random.Character}?${queryString}`)
    }
    return await mainClient.get(`${AppConfig.API_ENDPOINTS.EXTERNAL.Random.Base}`)
}


export const saveQuote = async (param: Quote) => {
    const result = new QuoteModel(param);
    await result.save();
    return result
}


export const saveMultipleQuotes = async (params: Quote[]) => {
    const result = await QuoteModel.insertMany(params, { ordered: false });
    const total = QuoteModel.countDocuments()
    return { quotes: result, total }
}

