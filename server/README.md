# server

Twirpのサーバー実装

## 起動方法

```shell
$ pwd
/path/to/twirp-playground/server

$ go run main.go
```

## リクエストの送信テスト

```shell
$ brew install httpie
$ http POST http://localhost:8080/twirp/user.UserService/GetUser id=test_id

HTTP/1.1 200 OK
Content-Length: 94
Content-Type: application/json
Date: Wed, 04 May 2022 06:24:26 GMT
Vary: Origin

{
    "user": {
        "birthdate": {
            "day": 24,
            "month": 11,
            "year": 1998
        },
        "id": "test_id",
        "name": "test_name"
    }
}
```