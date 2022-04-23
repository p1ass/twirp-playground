package main

import (
	"log"
	"net/http"

	"github.com/p1ass/twirp-playground/auth"
	"github.com/p1ass/twirp-playground/generated/twirp"
	"github.com/p1ass/twirp-playground/user"
)

func main() {
	mux := newMux()

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal(err)
	}
}

func newMux() *http.ServeMux {
	userService := user.NewService()
	userServiceServer := twirp.NewUserServiceServer(userService)

	authenticationService := auth.NewAuthService()
	authenticationServiceServer := twirp.NewAuthenticationServiceServer(authenticationService)
	authorizationServiceServer := twirp.NewAuthorizationServiceServer(authenticationService)

	mux := http.NewServeMux()
	mux.Handle(userServiceServer.PathPrefix(), userServiceServer)
	mux.Handle(authenticationServiceServer.PathPrefix(), authenticationServiceServer)
	mux.Handle(authorizationServiceServer.PathPrefix(), authorizationServiceServer)
	return mux
}
