import axios from 'axios';
import {Rpc, TwirpError} from "twirp-ts";

const client = axios.create({
    baseURL: "http://localhost:8080/twirp",
})

// Axiosを使ってリクエストを送る。
// 200以外のときはTwirpErrorにマッピングを試みる
export const AxiosRpcClient: Rpc = {
    request: function (service, method, contentType, data) {
        return client.post(`${service}/${method}`, data, {
            responseType: contentType === "application/protobuf" ? 'arraybuffer' : "json",
            headers: {
                "content-type": contentType,
            }
        }).then(response => {
            return response.data
        }).catch(error => {
            if (error.response && error.response.data) {
                console.log(error.response)
                throw TwirpError.fromObject(error.response.data)
            }
            throw error
        })
    }
}
