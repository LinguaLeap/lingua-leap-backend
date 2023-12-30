import { Router } from "express";
import { isAuthenticated } from "../middlewares/Auth";
import {
    Me,
    LoginWithGoogle,
    Register,
    Update,
    LoginWithEmail,
    ChangePassword,
} from "../controllers/Auth/Auth";
import passport from "passport";

const authRouter = Router();

// with Google
authRouter.get("/me", isAuthenticated, Me);
authRouter.get("/google", passport.authenticate("google"));
authRouter.get(
    "/google/redirect",
    passport.authenticate("google"),
    LoginWithGoogle
);

// with e-mail and password
authRouter.post("/register", Register);
authRouter.post("/login", LoginWithEmail);

authRouter.put("/update", isAuthenticated, Update);
authRouter.put("/changePassword", isAuthenticated, ChangePassword);

export default authRouter;
