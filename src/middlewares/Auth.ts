import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/jwtUtils";
import { getToken } from "../controllers/Auth";
import { User } from "../types/User";

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
        // @ts-ignore
        req.user = decodedToken.user;

        const storedToken = await getToken((req.user as User)._id);

        if (!storedToken || storedToken !== token.split(" ")[1]) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export { isAuthenticated };
