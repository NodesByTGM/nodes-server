import crypto from 'crypto';
import { StringMap } from "../interfaces";
import { AppConfig } from "./config";

export const verifyTransaction = (eventData: any, signature: any) => {
    const hmac = crypto.createHmac('sha512', `${process.env.PAYSTACK_API_SECRET_KEY}`);
    const expectedSignature = hmac.update(JSON.stringify(eventData)).digest('hex');
    return expectedSignature === signature;
}

export const objectToQueryString = (obj: StringMap) => {
    const keyValuePairs = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }

    return keyValuePairs.join('&');
}

export const generateOTP = (length = AppConfig.OTP_LENGTH) => {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}

export const isValid = (value: any) => {
    return value !== undefined && value !== "" && value !== null
}


export const isURL = (str: string): boolean => {
    // Regular expression for a simple URL pattern
    const urlRegex: RegExp = /^(http|https):\/\/[^ "]+$/;

    // Test the string against the regex
    return urlRegex.test(str);
}


export const formatDate = (date: string | Date) => {
    return (new Date(date)).toLocaleDateString();;
}

export const addYearsToDate = (date: string | Date, years = 1) => {
    const originalDate = new Date(date);
    const newDate = new Date(originalDate);
    newDate.setFullYear(originalDate.getFullYear() + years);
    return newDate.toLocaleDateString();
}

export const paginateData = (query: any, items: any, nameSpace?: string) => {
    const { page: _page, pageSize: _size } = query
    const page = parseInt(_page) || 1;
    const pageSize = parseInt(_size) || AppConfig.DEFAULT_PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const _items = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / pageSize);

    const data: any = {
        // message: AppConfig.STRINGS.Success,
        currentPage: page,
        pageSize,
        totalPages,
        totalItems: items.length,
        items: _items,
    }
    // if (nameSpace) {
    //     data[nameSpace] = _items
    // }
    return data
}

export function generateRandomPassword(length = AppConfig.GENERATED_PASSWORD_LENGTH): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}


export const getRegexList = (items: any[]) => {
    return items.map((item: string) => new RegExp(item, 'i'))
}

export const getLimitedText = (sentence: string = "") => {
    let words = sentence.split(" ");
    if (words.length > 10) {
        let limited = words.slice(0, 6).join(" ");
        if (limited.length > 130) {
            return `${limited.slice(0, 130)}...`;
        }
        return `${limited}...`;
    }
    return sentence;
};

export function generateRandomString(length = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function generateRandomFileName(length: number, extension: string): string {
    const randomString = generateRandomString(length);
    return randomString + '.' + extension;
}

export function getFileExtension(base64Data: string): string | null {
    // Define supported file types and their corresponding extensions
    const fileTypeMappings: { [key: string]: string } = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'application/pdf': 'pdf',
        'video/mp4': 'mp4',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav',
        'text/plain': 'txt',
        'application/json': 'json',
        'application/xml': 'xml',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        // Add more mappings as needed
    };

    // Extract the file type from the base64 data
    const match = base64Data.match(/^data:([a-z]+\/[a-z0-9-+.]+);base64,/i);
    if (!match) return null;

    // Extract the file type from the match
    const fileType = match[1];

    // Retrieve the extension based on the file type
    return fileTypeMappings[fileType.toLowerCase()] || null;
}

export const generateFileName = (file: string, path: string, name = '') => {
    const ext = getFileExtension(file);
    const randomName = name.length === 0 ? generateRandomString() : name;
    return `${path}/${randomName}.${ext}`
}