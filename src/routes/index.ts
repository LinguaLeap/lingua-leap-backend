import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import usersRouter from "./users";
import { isAuthenticated } from "../middlewares/Auth";
import { SampleData } from "../sampleData/data";
import chatRouter from "./chat";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", isAuthenticated, userRouter);
router.use("/users", isAuthenticated, usersRouter);

router.use("/chat", isAuthenticated, chatRouter);


router.get("/sampleData", SampleData);

export default router;
