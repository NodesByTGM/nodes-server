import { AppConfig } from "../utilities/config";

export const paginationQueryParams = [
    {
        name: 'page',
        in: 'query',
        description: 'Page number',
        required: false,
        schema: {
            type: 'integer',
            default: 1
        }
    },
    {
        name: 'pageSize',
        in: 'query',
        description: 'Number of items per page',
        required: false,
        schema: {
            type: 'integer',
            default: AppConfig.DEFAULT_PAGE_SIZE
        }
    }
]