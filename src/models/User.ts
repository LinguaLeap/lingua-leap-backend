import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
    },
    username: String,
    familyName: String,
    givenName: String,
    photos: [{ value: String }],
    emails: [{ value: String, verified: Boolean }],
});

const User = mongoose.model("User", userSchema);

export default User;
