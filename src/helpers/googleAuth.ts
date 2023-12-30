import passport from "passport";
import User from "../models/User";

import {
    Profile,
    Strategy as GoogleStrategy,
    VerifyCallback,
} from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URL || "",
            scope: ["email", "profile"],
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                const result = {
                    _id: existingUser._id,
                    googleId: existingUser.googleId,
                };
                done(null, result);
            } else {
                const newUser = await new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    familyName: profile.name?.familyName,
                    givenName: profile.name?.givenName,
                    photos: profile.photos,
                    emails: profile.emails,
                }).save();

                const result = {
                    _id: newUser._id,
                    googleId: newUser.googleId,
                };
                done(null, result);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    User.findById(user._id).then((user) => {
        done(null, user);
    });
});
