import mongoose, {Document, Schema} from "mongoose";
import {IUser} from "./user";

export interface IToDo extends Document {
    title: string,
    description?: string,
    author: IUser
}

const ToDoSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

export default mongoose.model<IToDo>("ToDo", ToDoSchema);