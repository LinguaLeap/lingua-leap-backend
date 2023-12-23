import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/jwtUtils";

const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const tokenValue = token.slice(7);

    try {
        const decodedToken = verifyToken(tokenValue);
        
        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = decodedToken;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export { isAuthenticated };
