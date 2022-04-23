# server

Twirpのサーバー実装

## リクエストの送信テスト

```shell
$ brew install httpie
$ http POST http://localhost:8080/twirp/user.UserService/GetUser id=test_id

HTTP/1.1 200 OK
Content-Length: 135
Content-Type: application/json
Date: Sat, 23 Apr 2022 06:39:12 GMT

{
    "user": {
        "address": {
            "city": "test_ci",
            "state": "test_state",
            "street_address": "test",
            "zip": "test_zip"
        },
        "id": "test_id",
        "name": "test_name"
    }
}
```