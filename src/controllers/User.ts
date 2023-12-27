import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import boom from "@hapi/boom";


export const GetUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    if (!id) {
        return next(boom.badRequest("ID is required"));
    }

    try {
        const user = await User.findById(id);

        if (!user) {
            return next(boom.notFound("User is not found!"));
        }
        
        res.json(user);
    } catch (e) {
        next(e);
    }
};