const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user.model');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists by email
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (user) {
            // User exists, return user
            return done(null, user);
        }

        // Create new user from Google profile
        user = new userModel({
            name: profile.displayName,
            email: profile.emails[0].value,
            profile_picture: {
                url: profile.photos[0]?.value || "https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg",
                fileId: null
            },
            googleId: profile.id,
            authProvider: 'google',
            password: null // OAuth users don't have password
        });

        await user.save();
        console.log("New user created via Google OAuth:", user.email);
        return done(null, user);
    } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
