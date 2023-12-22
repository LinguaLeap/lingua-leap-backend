import { NextFunction, Request, Response } from "express";

export const Hello = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.json({
        message: "hello ",
    });
};
