import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import usersRouter from "./users";
import { isAuthenticated } from "../middlewares/Auth";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", isAuthenticated, userRouter);
router.use("/users", isAuthenticated, usersRouter);

export default router;
