import { Router } from "express";
import { GetConversationsList, GetMessagesFromConversation } from "../controllers/Chat";

const chatRouter = Router();

chatRouter.get("/", GetConversationsList);
chatRouter.post("/", GetMessagesFromConversation);

export default chatRouter;
