import mongoose from "mongoose";

class Database {
    async connect(): Promise<void> {
        const mongoURI =
            process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
        try {
            await mongoose.connect(mongoURI);
            console.log("MongoDB Connected");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
        }
    }

    async disconnect(): Promise<void> {
        await mongoose.connection.close();
        console.log("MongoDB Disconnected");
    }
}

export default Database;
