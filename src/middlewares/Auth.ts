import { NextFunction, Request, Response } from "express";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) next();
    else res.redirect("/auth/google");
};

export { isAuthenticated };
