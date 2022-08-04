import mongoose from "mongoose";

const useMongo = async (url: string) => {
    // When successfully connected (Not needed because of the awai
    mongoose.connection.on("connected", () => console.log(`Connected to MongoDB: ${url}`));

    // If the connection throws an error
    mongoose.connection.on("error", err => console.error(`Cannot connect to MongoDB ${url} due to ${err}`));

    // When the connection is disconnected
    mongoose.connection.on("disconnected", () => console.log("Mongoose connection disconnected"));

    // If the Node process ends, close the Mongoose connection
    process.on("SIGINT", () => {
        mongoose.connection.close(() => {
            console.log("Disconnected from MongoDB because of app termination");
            process.exit(0);
        });
    });

    await mongoose.connect(url);
}

export default useMongo;
