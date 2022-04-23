package usecase

import (
	"context"

	"github.com/p1ass/twirp-playground/generated/twirp"
)

var _ twirp.AuthorizationService = (*Authorization)(nil)

// Authorization は境界づけられたコンテキストである「認可」のサービスです。
type Authorization struct {
}

func NewAuthorization() *Authorization {
	return &Authorization{}
}

func (s Authorization) Authorize(ctx context.Context, req *twirp.AuthorizeReq) (*twirp.AuthorizeRes, error) {
	panic("implement me")
}
