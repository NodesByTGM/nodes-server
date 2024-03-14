import { StringMap } from "../interfaces";
import { AppConfig } from "./config";

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
