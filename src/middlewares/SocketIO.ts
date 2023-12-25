import { getToken } from "../controllers/Auth";
import { verifyToken } from "../helpers/jwtUtils";

export const socketMiddleware = async (socket: any, next: any) => {
    const token = socket.handshake.query.token;
    if (token) {
        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            next(new Error("unauthorized"));
        }

        socket.data = decodedToken;

        const storedToken = await getToken(socket.data.user._id);

        if (!storedToken || storedToken !== token) {
            next(new Error("unauthorized"));
        }

        next();
    } else {
        next(new Error("unauthorized"));
    }
};
