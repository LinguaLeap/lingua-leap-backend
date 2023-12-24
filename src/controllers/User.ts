import { NextFunction, Request, Response } from "express";
import User from "../models/User";

export const GetUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    if (!id) {
        return res.status(401).json({ message: "ID is required" });
    }

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(401).json({ message: "User is not found!" });
        }
        
        res.json(user);
    } catch (e) {
        next(e);
    }
};
