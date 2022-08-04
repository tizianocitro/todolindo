import {MessageBroker} from "../types/message";
import useKafka, {connectConsumer, connectProducer, sendMessage} from "../config/kafka";
import {EachMessagePayload} from "kafkajs";

const connectToKafka = async (
    clientId: string,
    producerId: string,
    groupId: string,
    topicName: string,
    brokers: string[]
) => {
    const {producer, consumer}: MessageBroker = useKafka(
        clientId,
        producerId,
        groupId,
        brokers);
    await connectProducer(producer);
    const eachMessage = async ({topic, partition, message}: EachMessagePayload) => {
        console.log(`Received message on topic ${topic} and partition ${partition}`);
        if (message) {
            console.log(`Received content: ${message?.value?.toString()}`);
        }
    }
    await connectConsumer(consumer, topicName, eachMessage);
    await sendMessage(producer, topicName, {
        title: "My first Kafka todo",
        description: "My first Kafka todo description",
        author: {
            email: "tc@gmail.com",
            firstName: "Tiziano",
            lastName: "Citro",
        }
    });
}

export default connectToKafka;