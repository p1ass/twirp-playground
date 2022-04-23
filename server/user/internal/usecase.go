package internal

import (
	"context"

	"github.com/p1ass/twirp-playground/generated/twirp"
)

var _ twirp.UserService = (*User)(nil)

// User は境界づけられたコンテキストである「ユーザー」のサービスです。
// 現在はモジュラモノリスですが、今後マイクロサービスとして分離される可能性があります。
type User struct {
}

func NewUser() *User {
	return &User{}
}

func (s User) GetUser(ctx context.Context, req *twirp.GetUserReq) (*twirp.GetUserRes, error) {
	return &twirp.GetUserRes{
		User: &twirp.User{
			Id:   req.Id,
			Name: "test_name",
			Birthdate: &twirp.Date{
				Year:  1998,
				Month: 11,
				Day:   24,
			},
		},
	}, nil
}
