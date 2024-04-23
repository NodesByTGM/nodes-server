
import jwt from 'jsonwebtoken';

// Middleware to generate access tokens
export const generateAccessToken = (user: any) => {
    return jwt.sign({ accountId: user.id }, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '2h' });
};

// Middleware to generate refresh tokens
export const generateRefreshToken = (user: any) => {
    return jwt.sign({ accountId: user.id }, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '7d' });
};

// Verify access tokens
export const verifyAccessToken = (token: any) => {
    return jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
};

// Verify refresh tokens
export const verifyRefreshToken = (token: any) => {
    return jwt.verify(token, `${process.env.REFRESH_TOKEN_SECRET}`);
};
