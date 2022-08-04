import {Application} from "express";
import session from "express-session";
import connectRedis from "connect-redis";

export const useCookieSession = (app: Application) => {
    app.use(session({
        saveUninitialized: false,
        resave: true,
        secret: process.env.SESSION_SECRET || "",
        cookie: {secure: false}
    }));
}

export const useRedisSession = (app: Application, redis: any) => {
    const RedisStore = connectRedis(session);
    app.use(session({
        store: new RedisStore({client: redis}),
        saveUninitialized: false,
        resave: true,
        secret: process.env.SESSION_SECRET || "",
        cookie: {secure: false}
    }));
}