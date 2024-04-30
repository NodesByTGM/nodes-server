import dotenv from 'dotenv'

dotenv.config();
export const EXTERNAL_BASE_API_ENDPOINT = 'https://animechan.xyz/api'
export const BASE_API_ENDPOINT = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/v1' : 'https://dev.api.nodesafrica.com/api/v1'
export const BASE_APP_URL = `${process.env.BASE_APP_URL}`
export const BASE_ADMIN_APP_URL = `${process.env.BASE_ADMIN_APP_URL}`
export const SOCIAL_AUTH_GOOGLE_CALLBACK_URL = `${BASE_API_ENDPOINT}/socialauth/google/auth/redirect`

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


export enum OnboaringPurpose {
    NotSelected = 0,
    Connection = 1,
    Jobs = 2,
    Showcase = 3,
    ExploreProjects = 4,
    Others = 5,
}

export enum JobType {
    FullTime = 0,
    PartTime = 1,
    Contract = 2
}
const API_OBJECTS = {
    Project: 'Project',
    Space: 'Space',
    Post: 'Post',
    Account: 'Account',
    MiniAccount: 'MiniAccount',
    CommunityAccount: 'CommunityAccount',
    SingleCommunityAccount: 'SingleCommunityAccount',
    ConnectionRequest: 'ConnectionRequest',
    Connections: 'Connections',
    AcceptConnection: 'AcceptConnection',
    Media: 'Media',
    Job: 'Job',
    Event: 'Event',
    News: 'News',
    MoviesTV: 'Movies & TV Shows',
    Transaction: 'Transaction',
    Subscription: 'Subscription',
    Token: 'Token',
    Business: 'Business',
    Auth: 'Auth',
    Admin: 'Admin',
    Member: 'Member',
    OTP: 'OTP',
    Base: 'Base',
    Content: 'Content'
}


export const AppConfig = {
    API_ENDPOINTS,
    API_OBJECTS,
    ERROR_MESSAGES: {
        InvalidCredentialsProvided: 'Invalid Credentials Provided.',
        AuthenticationError: 'Authentication Error.',
        PermissionsDenied: 'You don\'t have access to this resource.',
        BadRequestError: 'Bad Request Error.',
        NotFoundError: 'Resource Not found.',
        InternalServerError: 'Internal Server Error.',
        ServiceUnavailable: 'Service Unavailable.',
        ResourceNotFound: 'Unable to process. Resource not found.',
        UnauthorizedAccess: 'Unable to process. You\'re not the owner of this resource.',
        ServerError: 'Unable to process request. Please try again later.',
        UserAlreadyExists: 'This email address provided is associated with an existing account.',
        UserAlreadyExistsUsername: 'This username provided is associated with an existing account.',
        InvalidLinkProvided: 'The link provided is either invalid or has expired.',
        InvalidOTPProvided: 'The OTP provided is either invalid or has expired.',
        ValidationError: 'All fields are required',
        TooManyRequests: 'Too many requests to external API.',
        HoldUp: 'Hold up, The characters behind the scenes cant keep coming up with quotes',
        UnverifiedEmail: 'Please verify your email first before proceeding.',
        AlreadySaved: 'You\'ve already saved this event.',
        AlreadyLiked: 'You\'ve already saved this post.',
        AlreadyApplied: 'You\'ve already applied for this job.',
        AlreadySavedJob: 'You\'ve already saved this job.',
        AlreadyRequestedConnection: 'You\'ve already sent a request to connect.',
        AlreadyConnected: 'You\'ve already connected to this account.',
        CantConnectYourself: 'You can\'t connect to yourself.',
        CantConnect: 'You can\'t connect to this account.',
    },
    STRINGS: {
        NewContactSubmission: 'New Contact Submission.',
        SubmittedSuccessfully: 'Thank you! we\'ve received your submission, we\'ll be in touch.',
        QuotesSuccessfullyRetrieved: 'Quotes successfully retrieved from Animechan and stored.',
        QuotesSuccessfullyRetrievedFromDB: 'Quotes successfully retrieved from DB.',
        QuoteSuccessfullyRetrievedFromDB: 'Quote successfully retrieved from DB.',
        RegistrationSuccessful: 'Registration successful.',
        InvitedUser: 'User has been successfully invited.',
        LoginSuccessful: 'Login successful',
        PasswordLinkSent: 'A password reset link has been sent to your email account.',
        PasswordResetSuccessful: 'Password has been reset successfully.',
        PasswordChangeSuccessful: 'Password changed successfully.',
        PasswordLinkEmailTitle: 'Password reset.',
        EmailVerificationSent: 'An OTP has been sent to your email for your verification.',
        EmailVerified: 'Your email has been verified successfully.',
        UsernameVerified: 'Your username has been verified successfully.',
        OTPVerified: 'Your OTP has been verified successfully.',
        AccountUpgradedTalent: 'Your account has been upgraded to a Talent account successfully.',
        OnboardingSuccessful: 'Your account has been onboarded successfully.',
        ProfileUpdateSuccessful: 'Your account has been updated successfully.',
        AccountUpgradedBusiness: 'Your account has been upgraded to a Business account successfully.',
        DetailsSentForVerification: 'Your details have been recieved for verification.',
        Success: 'Success.',
    },
    DEFAULT_PAGE_SIZE: 20,
    OTP_LENGTH: 4,
    ACCOUNT_ROLES: {
        USER: 0,
        ADMIN: 1,
    },
    ADMIN_ROLES: {
        SUPERADMIN: 9,
        MEMBER: 1,
    },
    ACCOUNT_TYPES: {
        DEFAULT: 0,
        TALENT: 1,
        BUSINESS: 2,
    },
    JOB_TYPES: {
        FULL_TIME: 0,
        PART_TIME: 1,
        CONTRACT: 2,
    },
    POST_TYPES: {
        Community: 0,
        Space: 0,
    },
    CONTENT_CATEGORIES: {
        Movies: 'Movies',
        Birthdays: 'Birthdays',
        HiddenGems: 'Hidden Gems',
        Flashbacks: 'Flashbacks',
        Spotlights: 'Collaboration Spotlights',
        TrendingNews: 'Trending News',
    },
    CONTENT_STATUSES: {
        Published: 'Published',
        Archived: 'Archived',
        Draft: 'Draft'
    },
    CONNECTION_REQUEST_STATUS: {
        Accepted: 'Accepted',
        Rejected: 'Rejected',
        Pending: 'Pending',
        Abandoned: 'Abandoned'
    },
    GENERATED_PASSWORD_LENGTH: 10,
    MEMBER_TYPES: {
        Member: 0,
        Admin: 1
    },
    TRANSACTION_DESC_TYPES: {
        MEMBERSHIP_FEE: 'MEMBERSHIP_FEE',
        SUBSCRIPTION: 'SUBSCRIPTION',
    },
    TRANSACTION_TYPES: {
        WW: 'WW', // Wallet to Wallet
        WE: 'WE', // Wallet to External
        EW: 'EW', // External to Wallet
        EE: 'EE' // External to Wallet
    },
    NOTIFICATION_TYPES: {
        JOB_APPLICATION: 'JOB_APPLICATION',
        BUSINESS_VERIFIED: 'BUSINESS_VERIFIED',
        POST_ACTIVITY: 'POST_ACTIVITY'
    },
    PLANS: {
        Pro: { name: 'Pro Plan', planCode: `${process.env.PRO_PLAN}` },
        Business: { name: 'Business Plan', planCode: `${process.env.BUSINESS_PLAN}` },
    }

}
