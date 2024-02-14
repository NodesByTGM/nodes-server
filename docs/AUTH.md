# Authentication Service API Documentation

This document provides an overview of the Authentication Service API
## Table of Contents

- [User Registration](#user-registration)
- [Login with an Existing User](#login-with-an-existing-user)
- [Send OTP via Email](#send-otp-via-email)
- [Verify Email with OTP](#verify-email-with-otp)
- [Verify OTP](#verify-otp)
- [Forgot Password](#forgot-password)
- [Check Reset Link](#check-reset-link)
- [Reset Password](#reset-password)
- [Change Password](#change-password)
- [Logout](#logout)

This is a bit rushed but its just a breakdown,
So I wanted to explain the registration process:
I'll make docs way better one day LOL

Register
Send OTP via Email
Verify OTP
User Registration

You can either verify then register or register then verify, either works.
The registration endpoint looks out for an OTP, if its not included, 
it just created an unverified account.

One last thing, for protected endpoints, you can use cookies or authentication headers like
`Authorization: 'Bearer/Token <TOKEN>'`