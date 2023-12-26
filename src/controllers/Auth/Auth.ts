import { NextFunction, Request, Response } from "express";
import { generateToken } from "../../helpers/jwtUtils";
import client from "../../configs/redisClient";
import { UserType } from "../../types/UserType";
import { RegisterValidation, UpdateValidation } from "./validation";
import User from "../../models/User";
import boom from "@hapi/boom";

export const LoginWithGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as UserType;

    const token = generateToken(user);

    storeToken(user._id, token);

    res.redirect(process.env.FRONTEND_URL + "/token/" + token);
};

export const LoginWithEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        "emails.value": email,
    });

    if (!user) {
        return next(boom.unauthorized("The email address was not found."));
    }
    // @ts-ignore
    const isMatched = await user.isValidPass(password);

    if (!isMatched) {
        return next(boom.unauthorized("email or password are not correct"));
    }

    const userData: UserType = user.toObject();
    //@ts-ignore
    delete userData.password;
    //@ts-ignore
    delete userData.__v;

    const token = generateToken(userData);

    storeToken(userData._id, token);

    res.json({ token });
};

export const Register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data: UserType = req.body;

    try {
        await RegisterValidation.validate(data);
    } catch (error: any) {
        return next(boom.badRequest(error.errors));
    }

    try {
        const isExists = await User.findOne({
            "emails.value": data.emails[0].value,
        });

        if (isExists) {
            return next(
                boom.notAcceptable("This e-mail is already registered.")
            );
        }

        const user = new User(data);
        const savedData = await user.save();
        const userData: UserType = savedData.toObject();
        //@ts-ignore
        delete userData.password;
        //@ts-ignore
        delete userData.__v;

        const token = generateToken(userData);

        storeToken(userData._id, token);

        res.json({ token });
    } catch (error) {
        next(error);
    }
};

export const Update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const data: UserType = req.body;

    try {
        await UpdateValidation.validate(data);
    } catch (error: any) {
        return next(boom.badRequest(error.errors));
    }

    if (data._id !== (req.user as UserType)._id) {
        return next(boom.illegal("You can not update another account."));
    }

    try {
        const updated = await User.findByIdAndUpdate(
            (req.user as UserType)._id,
            data
        );

        res.json({ message: "ok" });
    } catch (e) {
        next(e);
    }
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
