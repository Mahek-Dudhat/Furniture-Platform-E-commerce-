const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users.model.js');

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Google Profile:', profile);

            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // User exists - link Google ID if not already linked
                if (!user.googleId) {
                    user.googleId = profile.id;
                    user.isVerified = true;

                    // Set Google profile picture if user doesn't have one
                    if (!user.profilePicture || !user.profilePicture.url) {
                        user.profilePicture = {
                            url: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                            publicId: null // Google photos don't have publicId
                        };
                    }

                    await user.save();
                }
                console.log('✓ Existing user logged in:', user.email);
                return done(null, user);
            }

            // User doesn't exist - create new user
            user = await User.create({
                fullname: profile.displayName,        // "John Doe"
                email: profile.emails[0].value,   // "john@gmail.com"
                googleId: profile.id,             // Google's ID for this user
                isVerified: true,            // Google already verified email!
                profilePicture: {
                    url: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                    publicId: null // Google photos don't have publicId
                },

                // WHY: We need a password field in database
                // WHAT: Generate random password (user won't use it)
                password: 'GOOGLE_AUTH_' + Math.random().toString(36).slice(-8)

            }
            )

            console.log('✓ New user created via Google');
            return done(null, user);
        } catch (err) {
            console.error('Google strategy error:', err);

            return done(err, null);
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
