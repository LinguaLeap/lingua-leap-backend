import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import redis from "redis";

const client = redis.createClient();

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.header("Authorization")
        if(authorizationHeader){
            const token = authorizationHeader.replace("Bearer ", "");
            const decoded = jwt.verify(token, "your_jwt_secret");
            // Here you should fetch the user from MongoDB using the id from decoded object
            // And also check if the token is in the list of tokens in Redis
            client.get(decoded._id.toString(), (err: any, val: any) => {
                if (err) {
                    throw err;
                }
                if (val !== token) {
                    throw new Error();
                }
                req.user = decoded;
                next();
            });
            
        }
        
    } catch (error) {
        res.status(401).send({ error: "Please authenticate." });
    }
};
