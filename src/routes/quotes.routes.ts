import { Router } from "express";
import { allQuotesController, singleQuoteController } from "../controllers";
import { quoteParamsValidate, quoteQueryValidate } from "../middlewares";
import { AppConfig } from "../utilities/config";

const router = Router();

router.get(AppConfig.API_ENDPOINTS.Quotes.Base, quoteQueryValidate, allQuotesController);
router.get(AppConfig.API_ENDPOINTS.Quotes.Detail, quoteParamsValidate, singleQuoteController);

export default router;