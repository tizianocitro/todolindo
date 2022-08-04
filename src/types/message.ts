import {Consumer, Producer} from "kafkajs";

export type MessageBroker = {
    producer: Producer,
    consumer: Consumer
};
