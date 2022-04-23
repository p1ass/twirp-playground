# twirp-playground

HTTP/1.1に対応したシンプルなprotobufベースのRPCフレームワーク[Twirp](https://twitchtv.github.io/twirp/docs/intro.html) を試す。

## Getting Started

https://twitchtv.github.io/twirp/docs/install.html

必要なバイナリをインストールする。

```shell
go install github.com/twitchtv/twirp/protoc-gen-twirp@latest
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
```

コードを生成する。

```shell
IMPORT_PREFIX="github.com/p1ass/twirp-playground"
PROTO_SRC_PATH=./
protoc \
  --proto_path=$PROTO_SRC_PATH \
  --go_out=. \
  --go_opt=module=$IMPORT_PREFIX \
  --twirp_out=module=$IMPORT_PREFIX:. \
  proto/**/*.proto
```

--twirp_out=import_prefix=$IMPORT_PREFIX:$PROTO_SRC_PATH \

Goのimportパスを正しくするために、オプションを設定している。

https://twitchtv.github.io/twirp/docs/command_line.html#modifying-imports