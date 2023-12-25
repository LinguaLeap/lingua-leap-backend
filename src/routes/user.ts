import { Router } from "express";
import { GetUser } from "../controllers/User";

const userRouter = Router();

userRouter.get("/:id", GetUser);

export default userRouter;
