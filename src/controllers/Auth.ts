import { NextFunction, Request, Response } from "express";
import { generateToken } from "../helpers/jwtUtils";
import { storeToken } from "../configs/redisClient";

interface User {
    user: {
        _id: string;
    };
}

export const LoginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = (req.user as User).user._id.toString();
    const token = generateToken(userId);

    storeToken(userId, token);

    res.json({ token });
};

export const Me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};
