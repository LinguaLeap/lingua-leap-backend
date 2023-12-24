import { Router } from "express";
import { isAuthenticated } from "../middlewares/Auth";
import { GetUserList, SearchUserList } from "../controllers/Users";

const usersRouter = Router();

usersRouter.get("/", isAuthenticated, GetUserList);
usersRouter.post("/", isAuthenticated, SearchUserList);

export default usersRouter;
