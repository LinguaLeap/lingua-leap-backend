import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated } from "../middlewares/Auth";
import { authenticatedEndpoint, loginUser } from "../controllers/Auth";
import passport from "passport";

const router = Router();

router.get("/", isAuthenticated, authenticatedEndpoint);

router.get("/auth/google", passport.authenticate("google"), (req, res) =>
    res.send(200)
);
router.get("/auth/google/redirect", passport.authenticate("google"), loginUser);

export default router;
