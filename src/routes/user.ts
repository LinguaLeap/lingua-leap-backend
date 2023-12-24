import { Router } from "express";
import { isAuthenticated } from "../middlewares/Auth";
import { GetUser } from "../controllers/User";

const userRouter = Router();

userRouter.get("/:id", isAuthenticated, GetUser);

export default userRouter;
