import User from "./user";

interface ToDo {
    title: string,
    description?: string,
    author: User
}

export default ToDo;