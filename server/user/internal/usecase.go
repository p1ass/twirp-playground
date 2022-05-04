package internal

import (
	"context"

	"github.com/p1ass/twirp-playground/generated/pb"

	"github.com/twitchtv/twirp"
)

var _ pb.UserService = (*User)(nil)

// User は境界づけられたコンテキストである「ユーザー」のサービスです。
type User struct {
}

func NewUser() *User {
	return &User{}
}

func (s User) GetUser(ctx context.Context, req *pb.GetUserReq) (*pb.GetUserRes, error) {
	if req.GetId() == "" {
		return nil, twirp.InvalidArgumentError("id", "id is required")
	}
	// NOTE: 今回はサンプルなので、適当な値を返す
	return &pb.GetUserRes{
		User: &pb.User{
			Id:   req.Id,
			Name: "test_name",
			Birthdate: &pb.Date{
				Year:  1998,
				Month: 11,
				Day:   24,
			},
		},
	}, nil
}
