import jwt from "jsonwebtoken";
import { User } from "../types/User";

export const generateToken = (user: User): string => {
    return jwt.sign({ user }, process.env.JWT_SECRET_KEY || "", {
        expiresIn: "180d",
    });
};

export const verifyToken = (token: string): string | object => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
        return decoded;
    } catch (error) {
        return "";
    }
};
