import {Client} from "@elastic/elasticsearch";

// In case of error about the product not being recognized by the client
// Maybe the error is due to the server and client versions not being the same
// Client -> 7.11.0 (package.json) | Server -> 7.11.0 (docker-compose)
const useElasticSearch = (node: string): Client => {
    console.log("Connecting to ElasticSearch");
    const elastic = new Client({node});
    elastic
        .info()
        .then((response) => {
            console.log(`Connected to ElasticSearch with response: ${JSON.stringify(response)}`);
        })
        .catch((err) => {
            console.error(`Cannot connect to ElasticSearch due to: ${JSON.stringify(err)}`);
            throw err;
        });
    return elastic;
}

export default useElasticSearch;