import { RequestHandler } from "express";
import { QuotesQueryMap, Quote } from "../interfaces";
import { getQuotesFromDB, getQuotesFromExternal, getSingleQuoteFromDB, saveMultipleQuotes, saveQuote } from "../services";
import { AppConfig } from "../utilities/config";
import { QuoteModel } from "../mongodb/models";

export const allQuotesController: RequestHandler = async (req, res) => {
    try {
        const total = await QuoteModel.countDocuments()
        const { fetchNew } = req.query;
        if (fetchNew || total === 0) {
            const result = await getQuotesFromExternal(req.query as QuotesQueryMap);
            if (result.status === 200) {
                const savedQuotes = await saveMultipleQuotes(result.data)
                return res.status(200).json({ message: AppConfig.STRINGS.QuotesSuccessfullyRetrieved, data: savedQuotes })
            } else {
                return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ServerError })
            }
        } else {
            const result = await getQuotesFromDB(req.query as QuotesQueryMap);
            return res.json({ message: AppConfig.STRINGS.QuotesSuccessfullyRetrievedFromDB, data: result })
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ServerError })
    }
}

export const singleQuoteController: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id
        const result = await getSingleQuoteFromDB(id);
        return res.json({ message: AppConfig.STRINGS.QuoteSuccessfullyRetrievedFromDB, data: result })
    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ServerError })

    }
}

export const saveMultipleQuotesController: RequestHandler = async (req, res) => {
    try {
        const result = await saveMultipleQuotes(req.body as Quote[]);
        return res.json({ data: result })
    } catch (error) {
        return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ServerError })
    }
}


export const saveQuoteController: RequestHandler = async (req, res) => {
    try {
        const result = await saveQuote(req.body as Quote);
        return res.json({ data: result })
    } catch (error) {
        return res.status(400).json({ message: AppConfig.ERROR_MESSAGES.ServerError })
    }
}
