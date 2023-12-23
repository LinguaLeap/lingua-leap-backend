import jwt from "jsonwebtoken";

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY || "", {
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
