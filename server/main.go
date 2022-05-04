package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/p1ass/twirp-playground/config"
	"github.com/p1ass/twirp-playground/web"
)

func main() {
	handler := web.NewHandler()

	err := http.ListenAndServe(fmt.Sprintf(":%s", config.GetPORT()), handler)
	if err != nil {
		log.Fatal(err)
	}
}
