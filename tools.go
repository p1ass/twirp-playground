//go:build tools
// +build tools

// tools contains tools that are used by the project.
// https://github.com/go-modules-by-example/index/blob/master/010_tools/README.md
package main

import (
	_ "github.com/twitchtv/twirp/protoc-gen-twirp"
	_ "google.golang.org/protobuf/cmd/protoc-gen-go"
)
