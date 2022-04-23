package user

import (
	"github.com/p1ass/twirp-playground/generated/twirp"
	"github.com/p1ass/twirp-playground/user/internal"
)

// Service はユーザを表すサービスです。・
// 現在はモジュラモノリスですが、今後マイクロサービスとして分離される可能性があります。
type Service struct {
	twirp.UserService
}

func NewService() *Service {
	return &Service{
		internal.NewUser(),
	}
}
