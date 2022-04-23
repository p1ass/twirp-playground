package main

import (
	"context"
	"log"
	"net/http"

	"github.com/p1ass/twirp-playground/twirp"
)

func main() {
	server := &userService{}
	twirpHandler := twirp.NewUserServiceServer(server)

	err := http.ListenAndServe(":8080", twirpHandler)
	if err != nil {
		log.Fatal(err)
	}

}

type userService struct {
}

func (s userService) GetUser(ctx context.Context, req *twirp.GetUserReq) (*twirp.GetUserResponse, error) {
	return &twirp.GetUserResponse{
		User: &twirp.User{
			Id:   req.Id,
			Name: "test_name",
			Address: &twirp.Address{
				StreetAddress: "test",
				City:          "test_ci",
				State:         "test_state",
				Zip:           "test_zip",
			},
		},
	}, nil
}
