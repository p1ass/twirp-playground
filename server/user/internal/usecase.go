package internal

import (
	"context"

	"github.com/p1ass/twirp-playground/generated/pb"
)

var _ pb.UserService = (*User)(nil)

// User は境界づけられたコンテキストである「ユーザー」のサービスです。
// 現在はモジュラモノリスですが、今後マイクロサービスとして分離される可能性があります。
type User struct {
}

func NewUser() *User {
	return &User{}
}

func (s User) GetUser(ctx context.Context, req *pb.GetUserReq) (*pb.GetUserRes, error) {
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
