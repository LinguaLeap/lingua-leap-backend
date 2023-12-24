import { Router } from "express";
import { isAuthenticated } from "../middlewares/Auth";
import { Me, LoginUser } from "../controllers/Auth";
import passport from "passport";

const authRouter = Router();

authRouter.get("/me", isAuthenticated, Me);
authRouter.get("/google", passport.authenticate("google"));
authRouter.get("/google/redirect", passport.authenticate("google"), LoginUser);

export default authRouter;
