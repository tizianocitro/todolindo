// Try ioredis as dependency
import {createClient} from "redis";

const useRedis = async (url: string) => {
    const redis = createClient({url});
    redis.on("error", (err: any) => console.error(`Cannot connect to Redis ${url} due to ${err}`));
    redis.on("connect", () => console.log(`Connected to Redis: ${url}`));
    await redis.connect();
    return redis;
}

export default useRedis;