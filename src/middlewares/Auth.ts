import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/jwtUtils";
import { getToken } from "../controllers/Auth/Auth";
import { LoggedUser } from "../types/UserType";
import boom from "@hapi/boom";

const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return next(boom.unauthorized("UnAuthenticated"));
    }
    
    const tokenValue = token.slice(7);

    try {
        const decodedToken = verifyToken(tokenValue);

        if (!decodedToken) {
            return next(boom.unauthorized("UnAuthenticated"));
        }
        // @ts-ignore
        req.user = decodedToken.user;

        const storedToken = await getToken((req.user as LoggedUser)._id);

        if (!storedToken || storedToken !== token.split(" ")[1]) {
            return next(boom.unauthorized("UnAuthenticated"));
        }

        next();
    } catch (error) {
        return next(boom.unauthorized("UnAuthenticated"));
    }
};

export { isAuthenticated };
