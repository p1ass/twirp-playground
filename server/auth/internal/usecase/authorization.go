package usecase

import (
	"context"

	"github.com/p1ass/twirp-playground/generated/pb"
)

var _ pb.AuthorizationService = (*Authorization)(nil)

// Authorization は境界づけられたコンテキストである「認可」のサービスです。
type Authorization struct {
}

func NewAuthorization() *Authorization {
	return &Authorization{}
}

func (s Authorization) Authorize(ctx context.Context, req *pb.AuthorizeReq) (*pb.AuthorizeRes, error) {
	panic("implement me")
}
