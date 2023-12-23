import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
    },
    displayName: String,
    familyName: String,
    givenName: String,
    photos: [{ value: String }],
    emails: [{ value: String, verified: Boolean }],
    password: String,
    mainLanguage: String,
    otherLanguages: [
        {
            language: String,
            level: Number,
        },
    ],
    friends: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                unique: true,
                require: true,
            },
            status: {
                type: Boolean,
                default: false,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

export default User;
