import { AppConfig } from "../utilities/config";

// Common Schemas
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
        _id: { type: 'string' },
        id: { type: 'string' },
        url: { type: 'string', format: 'uri' }
    }
}

export const timestampProperties = {
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
}

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

export const responseSchema = {
    type: 'object',
    properties: {
        apiObject: { type: 'string' },
        code: { type: 'integer', example: 200 },
        status: { type: 'string', example: 'Success.' },
        isError: { type: 'boolean', example: false },
        message: { type: 'string' },
        result: { type: 'object' },
        errorMessage: { type: 'string' }
        // You might want to specify the schema for result if it's not always an empty object
    }
}


// Request Schemas
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

export const sendEmailToUsersRequestScema = {
    type: 'object',
    properties: {
        email: { type: 'string' },
        subject: { type: 'string' },
        message: { type: 'string' },
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

export const loginRequestSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            description: 'The email of the user.',
            example: 'john_doe',
        },
        username: {
            type: 'string',
            description: 'The username of the user.',
            example: 'john_doe',
        },
        // firebaseToken: {
        //     type: 'string',
        //     description: 'The username of the user.',
        //     example: 'john_doe',
        // },
        password: {
            type: 'string',
            format: 'password',
            description: 'The password of the user.',
            example: 'Password@123',
        },
    },
    required: ['password'],
}

export const emailRequestSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            description: 'The email of the user.',
            example: 'john_doe',
        },
    },
    required: ['email'],
}

export const verifyEmailOTPSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            description: 'The email of the user.',
            example: 'john_doe',
        },
        otp: {
            type: 'string',
            description: 'The one-time password (OTP) sent to the user\'s email address.',
            example: '123456',
        },
    },
    required: ['email', 'otp'],
}

export const changePasswordRequestSchema = {
    type: 'object',
    properties: {
        password: {
            type: 'string',
            format: 'password',
            description: 'The current password of the user.',
            example: 'currentPassword123',
        },
        newPassword: {
            type: 'string',
            format: 'password',
            description: 'The new password for the user.',
            example: 'newPassword456',
        },
    },
    required: ['password', 'newPassword'],
}

export const resetPasswordRequestSchema = {
    type: 'object',
    properties: {
        password: {
            type: 'string',
            format: 'password',
            description: 'The current password of the user.',
            example: 'currentPassword123',
        },
    },
    required: ['password', 'newPassword'],
}

export const refreshTokenRequestSchema = {
    type: 'object',
    properties: {
        refreshToken: {
            type: 'string',
            description: 'The refresh token.',
            example: 'your_refresh_token_here',
        },
    },
    required: ['refreshToken'],
}

// Query params
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

export const resetLinkParameters = [
    {
        in: 'path',
        name: 'accountId',
        required: true,
        schema: {
            type: 'string',
        },
        description: 'The unique identifier associated with the user\'s account.',
        example: 'abc123',
    },
    {
        in: 'path',
        name: 'token',
        required: true,
        schema: {
            type: 'string',
        },
        description: 'The token provided in the reset link.',
        example: 'xyz789',
    },
]


// Model Schemas
export const businessSchema = {
    type: 'object',
    properties: {
        // _id: { type: 'string' },
        name: { type: 'string' },
        yoe: { type: 'string', format: 'date-time' }, //TODO: can user change this?
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

export const subscriptionSchema = {
    type: 'object',
    properties: {
        plan: { type: 'string' },
        tenor: { type: 'string' },
        active: { type: 'boolean' },
        paidAt: { type: 'string', format: 'date-time' },
        id: { type: 'string' },
        ...timestampProperties
    }
}

export const notificationSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        message: { type: 'string', example: 'A user just liked your post' },
        foreignKey: { type: 'string' },
        type: { type: 'string', example: AppConfig.NOTIFICATION_TYPES.POST_ACTIVITY },
        account: { type: 'string', format: 'date-time' },
        ...timestampProperties
    }
}

export const connectionRequestSchema = {
    type: 'object',
    properties: {
        sender: { type: 'string' },
        recipient: { type: 'string' },
        message: { type: 'string' },
        id: { type: 'string' },
        status: { type: 'number' },
    }
}


export const userSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        firebaseToken: { type: 'string' },
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        dob: { type: 'string', format: 'date-time' },
        avatar: fileSwaggerSchema,
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        verified: { type: 'boolean' },
        spaces: { type: 'boolean' },
        step: { type: 'integer' },
        twitter: { type: 'string', format: 'uri' },
        website: { type: 'string', format: 'uri' },
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
        visible: { type: 'boolean' },
        subscription: subscriptionSchema,
        business: businessSchema,
        skills: {
            type: 'array',
            items: { type: 'string' }
        },
        onboardingPurposes: {
            type: 'array',
            items: { type: 'string' }
        },
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
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        type: { type: 'number' },
        headline: { type: 'string' },
        bio: { type: 'string' },
        avatar: fileSwaggerSchema,
    }
}

export const communityUserSchema = {
    type: 'object',
    properties: {
        ...userSchema.properties,
        connected: { type: 'boolean' },
        requested: { type: 'boolean' },
        connections: { type: 'array', items: miniUserSchema },
        subscription: undefined,
        firebaseToken: undefined
    }
}


export const connectionRequestResponseSchema = {
    type: 'object',
    properties: {
        user: communityUserSchema,
        request: connectionRequestSchema
    }
}
export const initConnectionRequestResponseSchema = {
    type: 'object',
    properties: {
        recipient: communityUserSchema,
        request: connectionRequestSchema
    }
}

export const jobSchema = {
    type: 'object',
    properties: {
        // _id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        experience: { type: 'string' },
        payRate: { type: 'string' },
        workRate: { type: 'string' },
        skills: {
            type: 'array',
            items: { type: 'string' }
        },
        jobType: { type: 'integer' },
        business: businessSchema,
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        applicants: {
            anyOf: [
                { type: 'null' },
                { type: 'string' },
                {
                    type: 'array',
                    items: miniUserSchema
                }
            ]
        },
        saves: {
            anyOf: [
                { type: 'null' },
                { type: 'string' },
                {
                    type: 'array',
                    items: miniUserSchema
                }
            ]
        },
        id: { type: 'string' },
        applied: { type: 'boolean' },
        saved: { type: 'boolean' }
    }
};

export const projectSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        projectURL: { type: 'string', format: 'uri' },
        images: {
            type: 'array',
            items: fileSwaggerSchema // Assuming image URLs are strings
        },
        collaborators: {
            type: 'array',
            items: fileSwaggerSchema // Assuming collaborator IDs are strings
        },
        owner: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        id: { type: 'string' }
    }
};

export const eventSchema = {
    type: 'object',
    properties: {
        //   _id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        location: { type: 'string' },
        dateTime: { type: 'string', format: 'date-time' },
        workRate: { type: 'string' },
        thumbnail: fileSwaggerSchema,
        business: businessSchema,
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        paymentType: { type: 'string' },
        id: { type: 'string' },
        saved: { type: 'boolean' },
        registered: { type: 'boolean' },
        saves: {
            anyOf: [
                { type: 'null' },
                {
                    type: 'array',
                    items: miniUserSchema
                }
            ]
        },
        attendees: {
            anyOf: [
                { type: 'null' },
                {
                    type: 'array',
                    items: miniUserSchema
                }
            ]
        },
    }
};

export const singleCommunityUserSchema = {
    type: 'object',
    properties: {
        ...communityUserSchema.properties,
        projects: { type: 'array', items: projectSchema },
        jobs: { type: 'array', items: jobSchema },
        events: { type: 'array', items: eventSchema },
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


export const tokensSchema = {
    type: 'object',
    properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' }
    }
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

export const transactionSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        apiId: { type: 'string' },
        amount: { type: 'number' },
        txnType: { type: 'string' },
        source: { type: 'string' },
        destination: { type: 'string' },
        status: { type: 'string' },
        description: { type: 'string' },
        subscription: subscriptionSchema,
        paidAt: { type: 'date', format: 'date-time' },
    }
}

// Schema generative functions
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
