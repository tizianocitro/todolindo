import {Request, Response} from "express";
import ToDoModel, {IToDo} from "../models/todo";
import UserModel, {IUser} from "../models/user";
import ToDo from "../interfaces/todo";
import {del, get, set} from "../services/cache";

export const findAll = async ({redis}: Request, res: Response) => {
    const cachedTodos: ToDo[] = await get(redis, "all");
    if (cachedTodos) {
        console.log("Found todos in cache");
        return res.status(200).send(cachedTodos);
    }
    console.log("Finding all todos from DB");
    const todos: IToDo[] = await ToDoModel.find({});
    let results: ToDo[] = [];
    for (const {title, description, author} of todos) {
        const user: IUser | null = await UserModel.findById(author);
        if (user) {
            const {email, firstName, lastName} = user;
            results.push({
                title,
                description,
                author: {email, firstName, lastName}
            });
        }
    }
    await set(redis, "all", results);
    return res.status(200).send(results);
}

export const save = async ({redis, body}: Request, res: Response) => {
    const {title, description, author}: ToDo = body;

    console.log("Saving todo author");
    const {_id, email, firstName, lastName}: IUser = await new UserModel(author).save();
    console.log("Saving todo")
    const todo: IToDo = await new ToDoModel({title, description, author: _id}).save();
    console.log("Todo saved");

    await del(redis, "all");
    return res.status(200).send({
        title: todo.title,
        description: todo.description,
        author: {email, firstName, lastName}
    });
}

export const index = async ({elastic}: Request, res: Response) => {
    if (!elastic) {
        return res.status(500).send("Cannot index due to client error");
    }
    const todos = require("../import/todos.json");

    // Formatting todos to documents by adding _index and _type
    const body = todos.flatMap((doc: ToDo) => [
        {index: {_index: "title", _type: "todo"}},
        doc,
    ]);

    const {body: bulkResponse} = await elastic.bulk({
        refresh: true,
        body,
    });
    if (bulkResponse.errors) {
        console.log(bulkResponse.errors);
    }
    const {body: count} = await elastic.count({index: "title"});
    console.log(`Counted indexes: ${JSON.stringify(count)}`);
    return res.status(200).send(count);
};

export const load = async ({elastic, query}: Request, res: Response) => {
    if (!elastic) {
        return res.status(500).send("Cannot index due to client error");
    }
    const {search} = query;
    try {
        const criteria = {
            index: "title",
            type: "todo",
            body: {
                size: 200,
                query: {match: {title: search}},
            }
        };
        const {body} = await elastic.search(criteria);
        return res.status(200).send(body);
    } catch (err) {
        console.error(`Cannot retrieve todo due to: ${err}`);
        return res.status(500).send(`Cannot retrieve todo due to: ${err}`);
    }
};