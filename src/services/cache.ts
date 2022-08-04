import {Cache} from "../types/cache"

export const get = async (cache: Cache, key: string): Promise<any> => {
    try {
        console.log(`Retrieving value with key: ${key}`);
        const cached = await cache.get(key);
        if (!cached) {
            return null;
        }
        return JSON.parse(cache);
    } catch (err) {
        console.log(`Error while retrieving from cache with key ${key} due to: ${err}`);
        return null;
    }
}

export const set = async (cache: Cache, key: string, value: any): Promise<boolean> => {
    try {
        const serializedValue = JSON.stringify(value);
        console.log(`Storing value: ${serializedValue}`);
        await cache.set(key, serializedValue);
        return true;
    } catch (err) {
        console.log(`Error while storing in cache due to: ${err}`);
        return false;
    }
}

export const del = async (cache: Cache, key: string): Promise<boolean> => {
    try {
        console.log(`Deleting value with key: ${key}`);
        await cache.del(key);
        return true;
    } catch (err) {
        console.log(`Error while deleting from cache with key ${key} due to: ${err}`);
        return false;
    }
}