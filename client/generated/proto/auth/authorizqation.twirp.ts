import {
  TwirpContext,
  TwirpServer,
  RouterEvents,
  TwirpError,
  TwirpErrorCode,
  Interceptor,
  TwirpContentType,
  chainInterceptors,
} from "twirp-ts";
import { AuthorizeReq, AuthorizeRes } from "./authorizqation";

//==================================//
//          Client Code             //
//==================================//

interface Rpc {
  request(
    service: string,
    method: string,
    contentType: "application/json" | "application/protobuf",
    data: object | Uint8Array
  ): Promise<object | Uint8Array>;
}

export interface AuthorizationServiceClient {
  Authorize(request: AuthorizeReq): Promise<AuthorizeRes>;
}

export class AuthorizationServiceClientJSON
  implements AuthorizationServiceClient
{
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Authorize.bind(this);
  }
  Authorize(request: AuthorizeReq): Promise<AuthorizeRes> {
    const data = AuthorizeReq.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "user.AuthorizationService",
      "Authorize",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      AuthorizeRes.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }
}

export class AuthorizationServiceClientProtobuf
  implements AuthorizationServiceClient
{
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Authorize.bind(this);
  }
  Authorize(request: AuthorizeReq): Promise<AuthorizeRes> {
    const data = AuthorizeReq.toBinary(request);
    const promise = this.rpc.request(
      "user.AuthorizationService",
      "Authorize",
      "application/protobuf",
      data
    );
    return promise.then((data) => AuthorizeRes.fromBinary(data as Uint8Array));
  }
}

//==================================//
//          Server Code             //
//==================================//

export interface AuthorizationServiceTwirp<
  T extends TwirpContext = TwirpContext
> {
  Authorize(ctx: T, request: AuthorizeReq): Promise<AuthorizeRes>;
}

export enum AuthorizationServiceMethod {
  Authorize = "Authorize",
}

export const AuthorizationServiceMethodList = [
  AuthorizationServiceMethod.Authorize,
];

export function createAuthorizationServiceServer<
  T extends TwirpContext = TwirpContext
>(service: AuthorizationServiceTwirp<T>) {
  return new TwirpServer<AuthorizationServiceTwirp, T>({
    service,
    packageName: "user",
    serviceName: "AuthorizationService",
    methodList: AuthorizationServiceMethodList,
    matchRoute: matchAuthorizationServiceRoute,
  });
}

function matchAuthorizationServiceRoute<T extends TwirpContext = TwirpContext>(
  method: string,
  events: RouterEvents<T>
) {
  switch (method) {
    case "Authorize":
      return async (
        ctx: T,
        service: AuthorizationServiceTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, AuthorizeReq, AuthorizeRes>[]
      ) => {
        ctx = { ...ctx, methodName: "Authorize" };
        await events.onMatch(ctx);
        return handleAuthorizeRequest(ctx, service, data, interceptors);
      };
    default:
      events.onNotFound();
      const msg = `no handler found`;
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleAuthorizeRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: AuthorizationServiceTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, AuthorizeReq, AuthorizeRes>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleAuthorizeJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleAuthorizeProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}
async function handleAuthorizeJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: AuthorizationServiceTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, AuthorizeReq, AuthorizeRes>[]
) {
  let request: AuthorizeReq;
  let response: AuthorizeRes;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = AuthorizeReq.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      AuthorizeReq,
      AuthorizeRes
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Authorize(ctx, inputReq);
    });
  } else {
    response = await service.Authorize(ctx, request!);
  }

  return JSON.stringify(
    AuthorizeRes.toJson(response, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    }) as string
  );
}
async function handleAuthorizeProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: AuthorizationServiceTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, AuthorizeReq, AuthorizeRes>[]
) {
  let request: AuthorizeReq;
  let response: AuthorizeRes;

  try {
    request = AuthorizeReq.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      AuthorizeReq,
      AuthorizeRes
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Authorize(ctx, inputReq);
    });
  } else {
    response = await service.Authorize(ctx, request!);
  }

  return Buffer.from(AuthorizeRes.toBinary(response));
}
