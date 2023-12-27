import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    familyName: String,
    givenName: String,
    photos: [{ value: String }],
    emails: [{ value: { type: String, unique: true}, verified: Boolean, }],
    gender: Number,
    birthDate: Date,
    country: Number,
    password: String,
    mainLanguage: [String],
    otherLanguages: [
        {
            language: String,
            level: Number,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre("save", async function (next) {
    try {
        if (this.isNew && this.password) {
            const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(this.password, salt);
			this.password = hashed;
        }

        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.isValidPass = async function (pass: any) {
    return await bcrypt.compare(pass, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;
