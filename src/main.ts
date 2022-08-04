import express, {Application, json} from "express";
import dotenv from "dotenv";
import useMongo from "./config/mongo";
import {useCookieSession} from "./config/session";
import useRoutes, {addClients} from "./config/routes";
import useRedis from "./config/redis";
import useElasticSearch from "./config/elasticsearch";
import connectToKafka from "./services/kafka";

const openConnections = async (app: Application) => {
    const redis = await useRedis(process.env.REDIS || "");
    const elasticSearch = useElasticSearch(process.env.ELASTICSEARCH || "");
    await useMongo(process.env.MONGO_DB || "");
    addClients(app, redis, elasticSearch);

    await connectToKafka(
        process.env.KAFKA_CLIENT_ID || "",
        process.env.KAFKA_PRODUCER_ID || "",
        process.env.KAFKA_GROUP_ID || "",
        process.env.KAFKA_TOPIC_NAME || "",
        [process.env.KAFKA || ""]);
}

const main = async () => {
    dotenv.config();
    const port = process.env.PORT || 8080;

    const app = express();
    app.use(json());
    await openConnections(app);
    useCookieSession(app);
    useRoutes(app);
    app.listen(port, () => console.log(`Application started at http://localhost:${port}`));
}

main().catch(err => console.log(`Cannot start application due to ${err}`));