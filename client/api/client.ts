import axios from 'axios';
import {Rpc} from "twirp-ts";

const client = axios.create({
    baseURL: "http://localhost:8080/twirp",
})

export const AxiosRpcClient: Rpc = {
    request(service, method, contentType, data) {
        return client.post(`${service}/${method}`, data, {
            responseType: contentType === "application/protobuf" ? 'arraybuffer' : "json",
            headers: {
                "content-type": contentType,
            }
        }).then(response => {
            return response.data
        });
    }
}
