package usecase

import (
	"context"

	"github.com/p1ass/twirp-playground/generated/pb"
	google_protobuf "google.golang.org/protobuf/types/known/emptypb"
)

var _ pb.AuthenticationService = (*Authentication)(nil)

// Authentication は境界づけられたコンテキストである「認証」のサービスです。
type Authentication struct {
}

func NewAuthentication() *Authentication {
	return &Authentication{}
}

func (a *Authentication) Authenticate(ctx context.Context, _ *google_protobuf.Empty) (*pb.AuthenticateRes, error) {
	// NOTE: 本来は適切な実装をするが、今回はこのサンプルでは何もしない。
	return &pb.AuthenticateRes{
		AuthenticatedAt: &pb.Date{
			Year:  2022,
			Month: 1,
			Day:   1,
		},
	}, nil
}
