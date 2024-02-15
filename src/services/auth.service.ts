
import jwt from 'jsonwebtoken';

// Middleware to generate access tokens
export const generateAccessToken = (user: any) => {
    return jwt.sign({ accountId: user.id }, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '1 hour' });
};

// Middleware to generate refresh tokens
export const generateRefreshToken = (user: any) => {
    return jwt.sign({ accountId: user.id }, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '1 day' });
};

// Verify tokens
export const verifyToken = (token: any) => {
    return jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
};
