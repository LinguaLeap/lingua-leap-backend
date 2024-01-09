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

interface QueryType {
    birthDate?: {
        $gte: Date,
        $lte: Date
    },
    gender?: number,
    country?: string,
    $or?: Array<any>
 }

export const SearchUserList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const filterObject = req.body;
    const page = parseInt(filterObject.pageParam) || 1;
    const startIndex = (page - 1) * limit;

    const query: QueryType = {}

    if(filterObject.endAge && filterObject.startAge) {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - filterObject?.endAge);

        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() - filterObject?.startAge);
        
        query.birthDate = {
            $gte: startDate,
            $lte: endDate
        }
    }

    if (filterObject.gender){
        query.gender = filterObject.gender;
    }
    
    if (filterObject.country) {
        query.country = filterObject.country
    }

    if(filterObject.language) {
        query.$or = [
            { mainLanguage: filterObject.language },
            {
                otherLanguages: {
                    $elemMatch: {
                        language: filterObject.language,
                        level: { $gte: filterObject.level },
                    },
                },
            },
        ]
    }

    try {
        /* for username search
            for (const key in filterObject) {
            if (typeof filterObject[key] === "string") {
                filterObject[key] = {
                    $regex: filterObject[key],
                    $options: "i",
                };
            }
        } */

        const users = await User.find(query)
            .skip(startIndex)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);
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
