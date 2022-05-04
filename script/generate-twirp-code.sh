#!/usr/bin/env sh
set -eu

echo "Installing dependencies..."

go install github.com/twitchtv/twirp/protoc-gen-twirp@latest
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

echo "Generating twirp server code..."

PROTO_SRC_PATH="./"
PROTO_FILES="./proto/**/*.proto"

# NOTE: Goのimportパスを正しくするために、オプションを設定している。
# https://twitchtv.github.io/twirp/docs/command_line.html#modifying-imports
GO_IMPORT_PREFIX="github.com/p1ass/twirp-playground"
GO_OUT_PATH="./server"
protoc \
  --proto_path=$PROTO_SRC_PATH \
  --go_out=$GO_OUT_PATH \
  --go_opt=module=$GO_IMPORT_PREFIX \
  --twirp_out=module=$GO_IMPORT_PREFIX:$GO_OUT_PATH \
  $PROTO_FILES

echo "Generating twirp client code..."

CLIENT_DIRECTORY="./client"
cd $CLIENT_DIRECTORY
yarn
cd ..

PROTOC_GEN_TWIRP_TS_BIN="$CLIENT_DIRECTORY/node_modules/.bin/protoc-gen-twirp_ts"
PROTOC_GEN_TS_BIN="$CLIENT_DIRECTORY/node_modules/.bin/protoc-gen-ts"
TS_OUT_DIR="$CLIENT_DIRECTORY/generated"

protoc \
  --proto_path=$PROTO_SRC_PATH \
  --plugin=protoc-gen-ts=$PROTOC_GEN_TS_BIN \
  --plugin=protoc-gen-twirp_ts=$PROTOC_GEN_TWIRP_TS_BIN \
  --ts_opt=client_none \
  --ts_opt=generate_dependencies \
  --ts_out=$TS_OUT_DIR \
  --twirp_ts_out=$TS_OUT_DIR \
  --twirp_ts_opt="openapi_twirp" \
  $PROTO_FILES