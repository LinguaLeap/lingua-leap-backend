import jwt from "jsonwebtoken";
import { UserType } from "../types/UserType";

export const generateToken = (user: UserType): string => {
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
