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

export const userSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'Name of the user',
        },
        avatar: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Unique identifier for the user\'s avatar',
                },
                url: {
                    type: 'string',
                    description: 'URL or binary data for the user\'s avatar',
                },
            },
        },
        skills: {
            type: 'array',
            items: {
                type: 'string',
            },
            description: 'Array of user skills',
        },
        location: {
            type: 'string',
            description: 'Location of the user',
        },
        linkedIn: {
            type: 'string',
            description: 'LinkedIn profile URL',
        },
        instagram: {
            type: 'string',
            description: 'Instagram profile URL',
        },
        twitter: {
            type: 'string',
            description: 'Twitter profile URL',
        },
        headline: {
            type: 'string',
            description: 'User\'s professional headline',
        },
        bio: {
            type: 'string',
            description: 'User\'s biography',
        },
        website: {
            type: 'string',
            description: 'User\'s personal website URL',
        },
        spaces: {
            type: 'boolean',
            description: 'Boolean indicating user\'s spaces',
        },
        comments: {
            type: 'boolean',
            description: 'Boolean indicating user\'s comments',
        },
        visible: {
            type: 'boolean',
            description: 'Boolean indicating user\'s profile visibility',
        },
        height: {
            type: 'string',
            description: 'Height of the user',
        },
        companyName: {
            type: 'string',
            description: 'Name of the company the user owns (Pro Plan)',
        },
        logo: {
            type: 'string',
            description: 'URL or binary data for the company logo (Pro Plan)',
        },
        yoe: {
            type: 'integer',
            description: 'Years of experience (Pro Plan)',
        },
    },
}

export const authUserSchema = {
    type: 'object',
    properties: {
        ...userSchema.properties,
        accessToken: {
            type: 'string',
            description: 'Your access token',
        },
        business: {
            type: 'object|null',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the user\'s business',
                },
                yoe: {
                    type: 'string',
                    description: 'Establishment year of the business',
                },
                account: {
                    type: 'string',
                    description: 'Owner\'s Id',
                },
                id: {
                    type: 'string',
                    description: 'Business\'s Id',
                },
                createdAt: {
                    type: 'string',
                    description: 'Creation DateTime',
                },
                updatedAt: {
                    type: 'string',
                    description: 'Updated DateTime',
                },
            },
        },
        subscription: {
            type: 'object|null',
            properties: {
                plan: {
                    type: 'string',
                    description: 'Subscription Plan',
                },
                active: {
                    type: 'boolean',
                    description: 'Boolean to show whether subscription is active or not',
                },
                account: {
                    type: 'string',
                    description: 'Owner\'s Id',
                },
                id: {
                    type: 'string',
                    description: 'Business\'s Id',
                },
                createdAt: {
                    type: 'string',
                    description: 'Creation DateTime',
                },
                updatedAt: {
                    type: 'string',
                    description: 'Updated DateTime',
                },
            },
        }
    },
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