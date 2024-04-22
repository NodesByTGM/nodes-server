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

export const fileSwaggerSchema = {
    anyOf: [
        { type: 'null' },
        {
            type: 'object',
            properties: {
                id: { type: 'string' },
                url: { type: 'string', format: 'uri' }
            }
        }
    ]
}

export const trueFileSwaggerSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        url: { type: 'string', format: 'uri' }
    }
}

export const businessSchema = {
    type: 'object',
    properties: {
        // _id: { type: 'string' },
        name: { type: 'string' },
        yoe: { type: 'string', format: 'date-time' },
        location: { type: 'string' },
        linkedIn: { type: 'string' },
        instagram: { type: 'string' },
        twitter: { type: 'string' },
        account: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        id: { type: 'string' }
    }
}

export const businessProfileRequestSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        logo: trueFileSwaggerSchema,
        yoe: { type: 'string', format: 'date-time' },
        location: { type: 'string' },
        linkedIn: { type: 'string' },
        instagram: { type: 'string' },
        twitter: { type: 'string' },
    },
}

export const verifyBusinessRequestSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        linkedIn: { type: 'string' },
        logo: fileSwaggerSchema,
        cac: trueFileSwaggerSchema,
        yoe: { type: 'string', format: 'date-time' },
    }
}

// TODO: can the user always change yoe
export const subscriptionSchema = {
    type: 'object',
    properties: {
        plan: { type: 'string' },
        active: { type: 'boolean' },
        paidAt: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        id: { type: 'string' }
    }
}

export const profileRequestSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        avatar: { type: 'string' }, // Assuming avatar is a URL string
        skills: {
            type: 'array',
            items: { type: 'string' } // Assuming skills are strings
        },
        location: { type: 'string' },
        linkedIn: { type: 'string', format: 'uri' },
        instagram: { type: 'string', format: 'uri' },
        twitter: { type: 'string', format: 'uri' },
        headline: { type: 'string' },
        bio: { type: 'string' },
        website: { type: 'string', format: 'uri' },
        spaces: { type: 'boolean' },
        comments: { type: 'boolean' },
        visible: { type: 'boolean' },
        height: { type: 'string' },
        age: { type: 'string' },
    }
};

export const userSchema = {
    type: 'object',
    properties: {
        onboardingPurposes: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        dob: { type: 'string', format: 'date-time' },
        avatar: fileSwaggerSchema,
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        verified: { type: 'boolean' },
        type: { type: 'integer' },
        age: { type: 'string' },
        bio: { type: 'string' },
        comments: { type: 'boolean' },
        headline: { type: 'string' },
        height: { type: 'string' },
        instagram: { type: 'string', format: 'uri' },
        linkedIn: { type: 'string', format: 'uri' },
        location: { type: 'string' },
        onboardingPurpose: { type: 'integer' },
        otherPurpose: { type: 'string' },
        skills: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        spaces: { type: 'boolean' },
        step: { type: 'integer' },
        twitter: { type: 'string', format: 'uri' },
        website: { type: 'string', format: 'uri' },
        business: {
            anyOf: [
                { type: 'null' },
                businessSchema
            ]
        },
        subscription: {
            anyOf: [
                { type: 'null' },
                subscriptionSchema
            ]
        },
        visible: { type: 'boolean' },
        id: { type: 'string' }
    }
};

export const adminSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        dob: { type: 'string', format: 'date-time' },
        avatar: fileSwaggerSchema,
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        verified: { type: 'boolean' },
        role: { type: 'integer' },
        id: { type: 'string' }
    }
};

export const miniUserSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        avatar: fileSwaggerSchema,
        id: { type: 'string' },
        type: { type: 'number' }
    }
}

export const adminMiniUserSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        avatar: fileSwaggerSchema,
        id: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        dateJoined: { type: 'string', format: 'date-time' },
        type: { type: 'number' }
    }
}

export const adminSubscriptionSchema = {
    type: 'object',
    properties: {
        ...subscriptionSchema.properties,
        account: miniUserSchema
    }
}

export const postSchema = {
    type: 'object',
    properties: {
        body: { type: 'string' },
        attachments: {
            type: 'array',
            items: fileSwaggerSchema
        },
        comments: {
            type: 'array',
            items: { type: 'object' } // Assuming comment IDs are strings
        },
        hashtags: {
            type: 'array',
            items: { type: 'string' } // Assuming hashtags are strings
        },
        author: miniUserSchema,
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        likes: {
            type: 'array',
            items: miniUserSchema
        },
        liked: { type: 'boolean' },
        id: { type: 'string' },
        foreignKey: { anyOf: [{ type: 'null' }, { type: 'string' }] },
        type: { type: 'string' },
    }
};

export const responseSchema = {
    type: 'object',
    properties: {
        apiObject: { type: 'string' },
        code: { type: 'integer', example: 200 },
        status: { type: 'string', example: 'Success.' },
        isError: { type: 'boolean', example: false },
        message: { type: 'string' },
        result: { type: 'object' }
        // You might want to specify the schema for result if it's not always an empty object
    }
}

export const tokensSchema = {
    type: 'object',
    properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' }
    }
}

export const authUserSchema = {
    type: 'object',
    properties: {
        user: userSchema.properties,
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' }
    }
}

export const adminAuthUserSchema = {
    type: 'object',
    properties: {
        user: userSchema.properties,
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' }
    }
}

export const timestampProperties = {
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
}

export const cmsSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string' },
        category: { type: 'string' },
        thumbnail: { type: trueFileSwaggerSchema },
        ...timestampProperties
    }
}

// const userSchema = {
//     type: 'object',
//     properties: {
//       username: { type: 'string' },
//       email: { type: 'string' }
//     },
//     anyOf: [
//       { required: ['username'] },
//       { required: ['email'] }
//     ]
//   };

export const paginatedSchema = {
    type: 'object',
    properties: {
        currentPage: { type: 'number' },
        pageSize: { type: 'number' },
        totalPages: { type: 'number' },
        totalItems: { type: 'number' },
        items: {
            type: 'array',
            items: { type: 'object' }
        }
    }
}

export const paginateSchema = (schema: any) => {
    return {
        type: 'object',
        properties: {
            ...paginatedSchema.properties,
            items: {
                type: 'array',
                items: schema

            }
        }
    }
}

export const constructResponseSchema = (schema: any, paginate = false) => {
    return {
        type: 'object',
        properties: {
            ...responseSchema.properties,
            result: paginate ? paginateSchema(schema) : schema
        }
    }
}

export const userSchemaExample = {
    name: "John Doe",
    username: "johnDoe",
    email: "john@tgm.com",
    dob: "2019-01-31T23:00:00.000Z",
    avatar: {
        id: "hyvtjydakafa",
        url: "https://jbkjnk.com/jubjhvjd/bfjkahbdkb.png"
    },
    createdAt: "2024-01-25T15:45:22.352Z",
    updatedAt: "2024-03-27T11:54:11.160Z",
    verified: true,
    type: 1,
    age: "",
    bio: "",
    comments: false,
    headline: "",
    height: "",
    instagram: "",
    linkedIn: "",
    location: "",
    onboardingPurpose: 0,
    otherPurpose: "",
    skills: [
        ""
    ],
    spaces: false,
    step: 0,
    twitter: "",
    website: "",
    business: {
        name: "John Doe",
        yoe: "2024-03-17T20:23:42.283Z",
        account: "xxyyyhhsbbdbgvaj",
        createdAt: "2024-03-17T20:23:42.442Z",
        updatedAt: "2024-03-17T20:23:42.442Z",
        id: "hbgdjagvjhbjds"
    },
    subscription: {
        plan: "Pro",
        active: true,
        paidAt: "2024-03-27T11:49:56.000Z",
        createdAt: "2024-03-27T11:54:11.159Z",
        updatedAt: "2024-03-27T11:54:11.159Z",
        id: "khbjvyikgb"
    },
    visible: true,
    id: "xxyyyhhsbbdbgvaj"
}