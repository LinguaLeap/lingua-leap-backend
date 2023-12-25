import { NextFunction, Request, Response } from "express";
import { generateToken } from "../helpers/jwtUtils";
import client from "../configs/redisClient";
import { User } from "../types/User";

export const LoginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as User;
    
    const token = generateToken(user);

    storeToken(user._id, token);
    
    res.redirect(process.env.FRONTEND_URL+"/token/"+ token);

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

export const storeToken = (userId: string, token: string): void => {
    //client.set(userId, token, { EX: 180 * 24 * 60 * 60 });
    client.set(userId, token, "EX", 180 * 24 * 60 * 60);
};

export const getToken = (userId: string): Promise<string | null> => {
    return new Promise((resolve) => {
        (client as any).get(userId, (err: any, reply: any) => {
            if (err) {
                resolve(null);
            } else {
                resolve(reply);
            }
        });
    });
};
