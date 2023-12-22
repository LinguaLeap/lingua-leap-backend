import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated } from "../middlewares/Auth";
import { Hello } from "../controllers/Auth";
import passport from "passport";

const router = Router();

router.get(
    "/",
    isAuthenticated,
    async (req: Request, res: Response, next: NextFunction) => {
        res.json({
            message: "hello logged",
        });
    }
);

router.get("/auth/google", passport.authenticate("google"), (req, res) =>
    res.send(200)
);
router.get(
    "/auth/google/redirect",
    passport.authenticate("google"),
    (req, res) => res.send(200)
);

router.get("/hello", Hello);

export default router;
