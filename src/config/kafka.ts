import {Consumer, EachMessagePayload, Kafka, Partitioners, Producer} from "kafkajs";
import {MessageBroker} from "../types/message";

const buildKafka = (clientId: string, brokers: string[]): Kafka => {
    console.log(`Building Kafka with brokers ${brokers}`);
    return new Kafka({clientId, brokers});
}

const buildProducer = (kafka: Kafka, producerId: string): Producer => {
    console.log(`Building producer: ${producerId}`);
    return kafka.producer({
        maxInFlightRequests: 1,
        idempotent: true,
        transactionalId: producerId,
        createPartitioner: Partitioners.LegacyPartitioner
    });
}

const buildConsumer = (kafka: Kafka, groupId: string): Consumer => {
    console.log(`Building consumer in group: ${groupId}`);
    return kafka.consumer({groupId});
}

export const connectConsumer = async (
    consumer: Consumer,
    topic: string,
    eachMessage: ({topic, partition, message}: EachMessagePayload) => Promise<void>
): Promise<void> => {
    console.log("Connecting consumer");
    await consumer.connect();
    await consumer.subscribe({topic, fromBeginning: true});
    await consumer.run({eachMessage});
    console.log("Consumer connected");
}

export const connectProducer = async (producer: Producer): Promise<void> => {
    console.log("Connecting producer");
    await producer.connect();
    console.log("Producer connected");
}

export const sendMessage = async (producer: Producer, topic: string, input: any): Promise<boolean> => {
    try {
        const value = JSON.stringify(input);
        console.log(`Sending message ${value} on topic ${topic}`);
        await producer.send({
            topic,
            messages: [{key: topic, value}],
        });
        return true;
    } catch (err) {
        console.error(`Cannot send message on topic ${topic} due to ${err}`);
        return false;
    }
}

const useKafka = (
    clientId: string,
    producerId: string,
    groupId: string,
    brokers: string[]
): MessageBroker => {
    const kafka = buildKafka(clientId, brokers);
    const producer = buildProducer(kafka, producerId);
    const consumer = buildConsumer(kafka, groupId);
    return {producer, consumer}
};

export default useKafka;