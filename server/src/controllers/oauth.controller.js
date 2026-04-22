const jwt = require('jsonwebtoken');

const googleCallback = async (req, res) => {
    try {
        // Passport already authenticated the user
        const user = req.user;

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Redirect to frontend with token and user data
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const userData = JSON.stringify({
            _id: user._id,
            name: user.name,
            email: user.email,
            profile_picture: user.profile_picture,
            authProvider: user.authProvider
        });

        // Encode userData to make it URL-safe
        const encodedUser = Buffer.from(userData).toString('base64');

        return res.redirect(
            `${frontendUrl}/auth-callback?token=${token}&user=${encodedUser}`
        );
    } catch (error) {
        console.error("OAuth callback error:", error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
};

module.exports = { googleCallback };
