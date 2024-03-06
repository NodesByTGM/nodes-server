export const usersSwagger = {
    paths: {
        '/api/v1/profile': {
            get: {
                summary: 'Get User Profile',
                description: 'Retrieve the authenticated user\'s profile information.',
                tags: ['Profile'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'User successfully registered.',
                        content: {
                            'application/json': {
                                example: {
                                    user: {
                                        id: '123456789',
                                        name: 'John Doe',
                                        email: 'john.doe@example.com',
                                        username: 'johndoe',
                                        dob: '1990-01-01',
                                        type: 1,
                                        avatar: 'https://example.com/avatar.jpg',
                                        verified: true,
                                        createdAt: '2024-02-14T12:00:00Z',
                                        updatedAt: '2024-02-14T12:30:00Z',
                                        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                                        talentProfile: {
                                            skills: 'Java, JavaScript, SQL',
                                            onboardingPurpose: 0,
                                            location: 'City, Country',
                                            linkedIn: 'https://www.linkedin.com/in/johndoe',
                                            instagram: 'https://www.instagram.com/johndoe',
                                            twitter: 'https://twitter.com/johndoe',
                                            accountId: 'user123',
                                        },
                                    },
                                },
                            },
                        },
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