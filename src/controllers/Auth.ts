import { NextFunction, Request, Response } from "express";
import { generateToken } from "../helpers/jwtUtils";
import { getToken, storeToken } from "../configs/redisClient";

interface User {
    existingUser: {
        _id: string;
    };
    userId: string;
}

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = (req.user as User).existingUser._id.toString();
    const token = generateToken(userId);

    storeToken(userId, token);

    res.json({ token });
};

export const authenticatedEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = (req.user as User).userId.toString();
    const storedToken = await getToken(userId);

    if (
        !storedToken ||
        storedToken !== req.headers.authorization?.split(" ")[1]
    ) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({ message: "Authorized" });
};
