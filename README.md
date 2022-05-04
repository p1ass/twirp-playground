# twirp-playground

HTTP/1.1に対応したシンプルなprotobufベースのRPCフレームワーク[Twirp](https://twitchtv.github.io/twirp/docs/intro.html) を試す。

## Getting Started

`protoc` コマンドをインストールする。

```shell
brew install protobuf
```

コードを生成する。

```shell
./script/generate-twirp-code.sh
```

## Server実装

[server/README.md](server/README.md)を参照。

## Client実装

[axios/README.md](axios/README.md)を参照。

## リファレンス

- https://twitchtv.github.io/twirp/docs/install.html