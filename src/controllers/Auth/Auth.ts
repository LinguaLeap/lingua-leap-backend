import { NextFunction, Request, Response } from "express";
import { generateToken } from "../../helpers/jwtUtils";
import client from "../../configs/redisClient";
import { LoggedUser, UserType } from "../../types/UserType";
import {
    LoginValidation,
    RegisterValidation,
    UpdateValidation,
} from "./validation";
import User from "../../models/User";
import boom from "@hapi/boom";

export const LoginWithGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(boom.unauthorized("Unauthorized"));
    }

    const user = req.user as LoggedUser;

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

    try {
        await LoginValidation.validate(req.body);
    } catch (error: any) {
        return next(boom.badRequest(error.errors));
    }

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

    const result: LoggedUser = {
        _id: user._id.toString(),
        googleId: null,
        //@ts-ignore
        token: user.password.slice(41),
    };

    const token = generateToken(result);

    storeToken(user._id.toString(), token);

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

        const result: LoggedUser = {
            _id: savedData._id.toString(),
            googleId: null,
            //@ts-ignore
            token: savedData.password.slice(41),
        };

        const token = generateToken(result);

        storeToken(savedData._id.toString(), token);

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

    if (data._id !== (req.user as LoggedUser)._id) {
        return next(boom.illegal("You can not update another account."));
    }

    try {
        const updated = await User.findByIdAndUpdate(
            (req.user as LoggedUser)._id,
            data
        );

        if (!updated) {
            return next(boom.notFound("User not found"));
        }

        const result: LoggedUser = {
            _id: updated._id.toString(),
            googleId: null,
            //@ts-ignore
            token: updated.password.slice(41),
        };

        const token = generateToken(result);

        storeToken(updated._id.toString(), token);

        res.json({ newToken: token });
    } catch (e) {
        next(e);
    }
};

export const Me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById((req.user as LoggedUser)._id).select(
            "-password -__v"
        );
        console.log(req.user)
        res.json({ user });
    } catch (error) {
        console.error(error);
        return next(boom.serverUnavailable("Server error"));
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
