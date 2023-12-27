import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import boom from "@hapi/boom";

const limit = 30;

export const GetUserList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page = parseInt(req.query.page as string) || 1;
    const startIndex = (page - 1) * limit;

    try {
        const users = await User.find().skip(startIndex).limit(limit);

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;

        if (!users) {
            return next(boom.notFound("User is not found!"));
        }

        const result = {
            users,
            pageInfo: {
                page,
                totalPages,
                totalUsers,
                limit,
                nextPage,
                prevPage,
            },
        };

        res.json(result);
    } catch (e) {
        next(e);
    }
};

export const SearchUserList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { filter } = req.body;
    const page = parseInt(req.query.page as string) || 1;
    const startIndex = (page - 1) * limit;

    try {
        const filterObject = JSON.parse(filter);

        for (const key in filterObject) {
            if (typeof filterObject[key] === "string") {
                filterObject[key] = {
                    $regex: filterObject[key],
                    $options: "i",
                };
            }
        }
        const users = await User.find(filterObject)
            .skip(startIndex)
            .limit(limit);

        const totalUsers = await User.countDocuments(filterObject);
        const totalPages = Math.ceil(totalUsers / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;

        if (users.length === 0) {
            return next(boom.notFound("User is not found!"));            
        }

        const result = {
            users,
            pageInfo: {
                page,
                totalPages,
                totalUsers,
                limit,
                nextPage,
                prevPage,
            },
        };

        res.json(result);
    } catch (e) {
        next(e);
    }
};
