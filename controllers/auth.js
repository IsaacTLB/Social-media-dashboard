import User from "../models/User.js";
import bcrypt from "bcrypt";
import Blacklist from '../models/Blacklist.js';

/**
 * @route POST v1/auth/register
 * @desc Registers a user
 * @access Public
 */
export async function Register(req, res) {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Redirect back to signup with a message if already exists
            return res.render("signup", {
                errors: [{ msg: "It seems you already have an account, please log in instead." }],
                oldInput: req.body
            });
        }

        // Create a new user instance
        const newUser = new User({
            first_name,
            last_name,
            email,
            password,
        });

        await newUser.save();

        // Redirect to login page after successful registration
        return res.redirect("/v1/login");

    } catch (err) {
        console.error("Registration Error:", err);
        return res.status(500).render("signup", {
            errors: [{ msg: "Internal Server Error" }],
            oldInput: req.body
        });
    }
}

/**
 * @route POST v1/auth/login
 * @desc Logs in a user
 * @access Public
 */
export async function Login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.render("login", {
                errors: [{ msg: "Account does not exist." }],
                oldInput: req.body
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render("login", {
                errors: [{ msg: "Invalid email or password." }],
                oldInput: req.body
            });
        }

        const token = user.generateAccessJWT();

        res.cookie("SessionID", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 20 * 60 * 1000, // 20 minutes
        });

        // Redirect to dashboard or homepage after login
        return res.redirect("/v1/user");

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).render("login", {
            errors: [{ msg: "Internal Server Error" }],
            oldInput: req.body
        });
    }
}

/**
 * @route POST v1/auth/logout
 * @desc Logs out a user
 * @access Public
 */
export async function Logout(req, res) {
    try {
        const authHeader = req.headers['cookie']; // Get the session cookie from the request header
        if (!authHeader) return res.sendStatus(204); // No content

        // Extract the token from the cookie string
        const cookie = authHeader.split('=')[1];
        const accessToken = cookie.split(';')[0];

        // Check if token is blacklisted
        const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
        if (checkIfBlacklisted) return res.sendStatus(204); // Token already blacklisted

        // Blacklist the token
        const newBlacklist = new Blacklist({ token: accessToken });
        await newBlacklist.save();

        // Clear the session cookie on the client
        res.clearCookie('SessionID', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.status(200).json({ message: 'You are logged out!' });
        res.redirect("/v1/login");
    } catch (err) {
        console.error("Logout Error:", err);  // Log the error
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
}
