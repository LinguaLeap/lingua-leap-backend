import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import usersRouter from "./users";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/users", usersRouter);

export default router;
