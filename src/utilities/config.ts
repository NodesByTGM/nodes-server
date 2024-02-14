export const EXTERNAL_BASE_API_ENDPOINT = 'https://animechan.xyz/api'
export const BASE_API_ENDPOINT = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/v1' : 'https://nodes-server-v1.onrender.com/api/v1'
export const MAIN_APP_SERVER = 'https://nodes-platform.vercel.app'
export const SOCIAL_AUTH_GOOGLE_URL = `${BASE_API_ENDPOINT}/auth/google/redirect`

const API_ENDPOINTS = {
    Quotes: {
        Base: '/',
        Detail: '/:id',
    },
    EXTERNAL: {
        Random: {
            Base: `${EXTERNAL_BASE_API_ENDPOINT}/random`,
            Character: `${EXTERNAL_BASE_API_ENDPOINT}/random/character`,
            AnimeTitle: `${EXTERNAL_BASE_API_ENDPOINT}/random/anime`,
        },
        Quotes: {
            Base: `${EXTERNAL_BASE_API_ENDPOINT}/quotes`,
            Character: `${EXTERNAL_BASE_API_ENDPOINT}/quotes/character`,
            AnimeTitle: `${EXTERNAL_BASE_API_ENDPOINT}/quotes/anime`,
        }
    }

}

export const AppConfig = {
    API_ENDPOINTS,
    ERROR_MESSAGES: {
        InvalidCredentialsProvided: 'Invalid Credentials Provided.',
        AuthenticationError: 'Authentication Error.',
        BadRequestError: 'Bad Request Error.',
        NotFoundError: 'Resource Not found.',
        InternalServerError: 'Internal Server Error.',
        ResourceNotFound: 'Unable to process. Resource not found.',
        ServerError: 'Unable to process request. Please try again later.',
        UserAlreadyExists: 'This email address provided is associated with an existing account.',
        InvalidLinkProvided: 'The link provided is either invalid or has expired.',
        InvalidOTPProvided: 'The OTP provided is either invalid or has expired.',
        ValidationError: 'All fields are required',
        TooManyRequests: 'Too many requests to external API.',
        HoldUp: 'Hold up, The characters behind the scenes cant keep coming up with quotes',
        UnverifiedEmail: 'Please verify your email first before proceeding.',
    },
    STRINGS: {
        NewContactSubmission: 'New Contact Submission.',
        SubmittedSuccessfully: 'Thank you! we\'ve received your submission, we\'ll be in touch.',
        QuotesSuccessfullyRetrieved: 'Quotes successfully retrieved from Animechan and stored.',
        QuotesSuccessfullyRetrievedFromDB: 'Quotes successfully retrieved from DB.',
        QuoteSuccessfullyRetrievedFromDB: 'Quote successfully retrieved from DB.',
        RegistrationSuccessful: 'Registration successful.',
        PasswordLinkSent: 'A password reset link has been sent to your email account.',
        PasswordResetSuccessful: 'Password has been reset successfully.',
        PasswordChangeSuccessful: 'Password changed successfully.',
        PasswordLinkEmailTitle: 'Password reset.',
        EmailVerificationSent: 'An OTP has been sent to your email for your verification.',
        EmailVerified: 'Your email has been verified successfully.',
        OTPVerified: 'Your OTP has been verified successfully.',
        AccountUpgradedTalent: 'Your account has been upgraded to a Talent account successfully.',
        AccountUpgradedBusiness: 'Your account has been upgraded to a Business account successfully.',
        Success: 'Success.',
    },
    DEFAULT_PAGE_SIZE: 5,
    OTP_LENGTH: 4,
    ACCOUNT_ROLES: {
        USER: 0,
        ADMIN: 1,
    },
    ACCOUNT_TYPES: {
        DEFAULT: 0,
        TALENT: 1,
        BUSINESS: 2,
    },
}