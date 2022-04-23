package usecase

import (
	"context"

	"github.com/p1ass/twirp-playground/generated/twirp"
)

var _ twirp.AuthenticationService = (*Authentication)(nil)

// Authentication は境界づけられたコンテキストである「認証」のサービスです。
// 現在はモジュラモノリスですが、今後マイクロサービスとして分離される可能性があります。
type Authentication struct {
}

func NewAuthentication() *Authentication {
	return &Authentication{}
}

func (a *Authentication) Authenticate(ctx context.Context, req *twirp.AuthenticateReq) (*twirp.AuthenticateRes, error) {
	return &twirp.AuthenticateRes{
		AuthenticatedAt: &twirp.Date{
			Year:  2022,
			Month: 1,
			Day:   1,
		},
	}, nil
}
