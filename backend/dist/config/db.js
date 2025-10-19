"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MongoDB connection string not found in environment variables'.red.bold);
            process.exit(1);
        }
        const options = {
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000,
        };
        const conn = await mongoose_1.default.connect(mongoUri, options);
        mongoose_1.default.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err.message}`.red.bold);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected, attempting to reconnect...'.yellow);
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
        return conn.connection;
    }
    catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`.red.bold);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map