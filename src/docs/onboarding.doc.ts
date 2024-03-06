export const onboardingSwagger = {
    paths: {
        '/api/v1/onboarding/talent': {
            post: {
                summary: 'Onboard Account as Talent Account',
                description: 'Onboard the authenticated user\'s account to a talent account by providing additional information.',
                tags: ['Onboarding'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    skills: {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                        },
                                        description: 'List of skills associated with the talent account.',
                                        example: ['JavaScript', 'React', 'Node.js'],
                                    },
                                    location: {
                                        type: 'string',
                                        description: 'The location of the talent (e.g., city, country).',
                                        example: 'San Francisco, CA',
                                    },
                                    avatar: {
                                        type: 'string',
                                        description: 'URL or path to the talent\'s avatar.',
                                        example: 'https://example.com/avatar/talent_user.jpg',
                                    },
                                    linkedIn: {
                                        type: 'string',
                                        description: 'LinkedIn profile URL of the talent.',
                                        example: 'https://www.linkedin.com/in/talent_user',
                                    },
                                    instagram: {
                                        type: 'string',
                                        description: 'Instagram profile URL of the talent.',
                                        example: 'https://www.instagram.com/talent_user',
                                    },
                                    twitter: {
                                        type: 'string',
                                        description: 'Twitter profile URL of the talent.',
                                        example: 'https://twitter.com/talent_user',
                                    },
                                    otherPurpose: {
                                        type: 'string',
                                        description: 'My actual reason for being here',
                                        example: 'I just want to play',
                                    },
                                    step: {
                                        type: 'number',
                                        description: 'Progress on the onboarding form.',
                                        example: 0,
                                    },
                                    onboardingPurpose: {
                                        type: 'number',
                                        description: 'Purpose for onboarding.',
                                        example: 0,
                                    },
                                },
                                required: ['onboardingPurpose'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Account successfully upgraded to talent.',
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
        
        '/api/v1/onboarding/business': {
            post: {
                summary: 'Onboard Account as Business Account',
                description: 'Onboard the authenticated user\'s account to a business account by providing additional business information.',
                tags: ['Onboarding'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    companyName: {
                                        type: 'string',
                                        description: 'The name of the business company.',
                                        example: 'ABC Corporation',
                                    },
                                    logo: {
                                        type: 'string',
                                        description: 'URL or path to the business logo.',
                                        example: 'https://example.com/logo/business_logo.png',
                                    },
                                    avatar: {
                                        type: 'string',
                                        description: 'URL or path to the business avatar.',
                                        example: 'https://example.com/avatar/business_avatar.jpg',
                                    },
                                    website: {
                                        type: 'string',
                                        description: 'The website URL of the business.',
                                        example: 'https://www.abccorporation.com',
                                    },
                                    location: {
                                        type: 'string',
                                        description: 'The location of the business (e.g., city, country).',
                                        example: 'New York, NY',
                                    },
                                    industry: {
                                        type: 'string',
                                        description: 'The industry in which the business operates.',
                                        example: 'Technology',
                                    },
                                    tagline: {
                                        type: 'string',
                                        description: 'The tagline or slogan of the business.',
                                        example: 'Innovate Together',
                                    },
                                    size: {
                                        type: 'string',
                                        description: 'The size of the business (e.g., small, medium, large).',
                                        example: 'Medium',
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'The type of business (e.g., LLC, Corporation).',
                                        example: 'LLC',
                                    },
                                    linkedIn: {
                                        type: 'string',
                                        description: 'LinkedIn profile URL of the business.',
                                        example: 'https://www.linkedin.com/company/abccorporation',
                                    },
                                    instagram: {
                                        type: 'string',
                                        description: 'Instagram profile URL of the business.',
                                        example: 'https://www.instagram.com/abccorporation',
                                    },
                                    twitter: {
                                        type: 'string',
                                        description: 'Twitter profile URL of the business.',
                                        example: 'https://twitter.com/abccorporation',
                                    },
                                    profession: {
                                        type: 'string',
                                        description: 'The profession or industry focus of the business.',
                                        example: 'IT Solutions',
                                    },
                                },
                                required: ['companyName', 'location', 'industry', 'tagline', 'size', 'type', 'profession'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Account successfully upgraded to a business account.',
                    },
                    '400': {
                        description: 'Bad request. Check the request payload for missing or invalid information.',
                    },
                    '401': {
                        description: 'Unauthorized. User authentication failed.',
                    },
                    '500': {
                        description: 'Internal Server Error.',
                    },
                },
            },
        },
    }
}