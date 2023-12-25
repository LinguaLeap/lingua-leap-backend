import { Router } from "express";
import { GetUserList, SearchUserList } from "../controllers/Users";

const usersRouter = Router();

usersRouter.get("/", GetUserList);
usersRouter.post("/", SearchUserList);

export default usersRouter;
