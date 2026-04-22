const express = require('express');
const passport = require('passport');
const oauthController = require('../controllers/oauth.controller');

const router = express.Router();

// Initiate Google OAuth login
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }),
    oauthController.googleCallback
);

module.exports = router;
