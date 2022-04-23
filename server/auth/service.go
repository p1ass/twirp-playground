package auth

import (
	"github.com/p1ass/twirp-playground/auth/internal/usecase"
	"github.com/p1ass/twirp-playground/generated/twirp"
)

// Service は認証認可を表すサービスです。・
// 現在はモジュラモノリスですが、今後マイクロサービスとして分離される可能性があります。
type Service struct {
	twirp.AuthenticationService
	twirp.AuthorizationService
}

func NewAuthService() *Service {
	return &Service{
		usecase.NewAuthentication(),
		usecase.NewAuthorization(),
	}
}
