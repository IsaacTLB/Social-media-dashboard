import User from "../models/User.js";
import Blacklist from "../models/Blacklist.js";  // Ensure Blacklist model is imported
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";  // Ensure SECRET_ACCESS_TOKEN is imported

// Middleware to verify JWT and check blacklisting
export async function Verify(req, res, next) {
    try {
        // Retrieve the cookie from request headers (Check for existence of cookies)
        const authHeader = req.headers["cookie"];
        if (!authHeader) return res.sendStatus(401); // If no cookies, send Unauthorized status
        
        // Safely extract access token from the cookie
        const cookie = authHeader.split("=")[1]?.split(";")[0];  // Avoid index errors
        if (!cookie) return res.status(400).json({ message: "Invalid cookie format" });

        const accessToken = cookie;

        // Check if the token is blacklisted
        const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
        if (checkIfBlacklisted)
            return res.status(401).json({ message: "This session has expired. Please login" });

        // Verify the token with JWT
        jwt.verify(accessToken, SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                // If JWT is invalid or expired, return Unauthorized response
                return res.status(401).json({ message: "This session has expired. Please login" });
            }

            const { id } = decoded; // Get the user id from decoded JWT
            const user = await User.findById(id); // Find user in the database

            // Handle case where user is not found (e.g., token is tampered or user is deleted)
            if (!user) {
                return res.status(401).json({ message: "User not found. Please login" });
            }

            const { password, ...data } = user._doc; // Exclude password from the user data
            req.user = data; // Attach user data to the request object
            next(); // Proceed to the next middleware or route handler
        });
    } catch (err) {
        console.error(err); // Log error for debugging purposes
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
        });
    }
}

// Middleware to verify user role
export function VerifyRole(req, res, next) {
    try {
        const user = req.user; // Access user data from the request object
        const { role } = user; // Extract the user's role

        // Check if the user has the required role (e.g., admin role)
        if (role !== "0x88") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorized to view this page.",
            });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err); // Log error for debugging purposes
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
        });
    }
}
