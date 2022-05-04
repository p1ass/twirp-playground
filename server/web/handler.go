package web

import (
	"net/http"

	"github.com/p1ass/twirp-playground/auth"
	"github.com/p1ass/twirp-playground/config"
	"github.com/p1ass/twirp-playground/generated/pb"
	"github.com/p1ass/twirp-playground/user"
	"github.com/rs/cors"
)

func NewHandler() http.Handler {
	userService := user.NewService()
	userServiceServer := pb.NewUserServiceServer(userService)

	authenticationService := auth.NewAuthService()
	authenticationServiceServer := pb.NewAuthenticationServiceServer(authenticationService)
	authorizationServiceServer := pb.NewAuthorizationServiceServer(authenticationService)

	mux := http.NewServeMux()
	mux.Handle(userServiceServer.PathPrefix(), userServiceServer)
	mux.Handle(authenticationServiceServer.PathPrefix(), authenticationServiceServer)
	mux.Handle(authorizationServiceServer.PathPrefix(), authorizationServiceServer)

	// Make a CORS wrapper
	corsWrapper := cors.New(cors.Options{
		AllowedOrigins: []string{config.GetClientURL()},
		AllowedMethods: []string{"POST"},
		AllowedHeaders: []string{"Content-Type"},
	})

	handler := corsWrapper.Handler(mux)

	return handler
}
