import { getToken } from "../controllers/Auth/Auth";
import { verifyToken } from "../helpers/jwtUtils";

export const socketMiddleware = async (socket: any, next: any) => {
    const token = socket.handshake.auth.token;
    if (token) {
        if (!token.startsWith("Bearer ")) {
            return next(new Error("unauthorized"));
        }

        const tokenValue = token.slice(7);

        const decodedToken = verifyToken(tokenValue);

        if (!decodedToken) {
            return next(new Error("unauthorized"));
        }

        socket.data = decodedToken;

        const storedToken = await getToken(socket.data.user._id);

        if (!storedToken || storedToken !== tokenValue) {
            return next(new Error("unauthorized"));
        }

        next();
    } else {
        return next(new Error("unauthorized"));
    }
};
