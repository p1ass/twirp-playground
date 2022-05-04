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
import { Empty } from "../../google/protobuf/empty";
import { AuthenticateRes } from "./authentication";

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

export interface AuthenticationServiceClient {
  Authenticate(request: Empty): Promise<AuthenticateRes>;
}

export class AuthenticationServiceClientJSON
  implements AuthenticationServiceClient
{
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Authenticate.bind(this);
  }
  Authenticate(request: Empty): Promise<AuthenticateRes> {
    const data = Empty.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "user.AuthenticationService",
      "Authenticate",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      AuthenticateRes.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }
}

export class AuthenticationServiceClientProtobuf
  implements AuthenticationServiceClient
{
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Authenticate.bind(this);
  }
  Authenticate(request: Empty): Promise<AuthenticateRes> {
    const data = Empty.toBinary(request);
    const promise = this.rpc.request(
      "user.AuthenticationService",
      "Authenticate",
      "application/protobuf",
      data
    );
    return promise.then((data) =>
      AuthenticateRes.fromBinary(data as Uint8Array)
    );
  }
}

//==================================//
//          Server Code             //
//==================================//

export interface AuthenticationServiceTwirp<
  T extends TwirpContext = TwirpContext
> {
  Authenticate(ctx: T, request: Empty): Promise<AuthenticateRes>;
}

export enum AuthenticationServiceMethod {
  Authenticate = "Authenticate",
}

export const AuthenticationServiceMethodList = [
  AuthenticationServiceMethod.Authenticate,
];

export function createAuthenticationServiceServer<
  T extends TwirpContext = TwirpContext
>(service: AuthenticationServiceTwirp<T>) {
  return new TwirpServer<AuthenticationServiceTwirp, T>({
    service,
    packageName: "user",
    serviceName: "AuthenticationService",
    methodList: AuthenticationServiceMethodList,
    matchRoute: matchAuthenticationServiceRoute,
  });
}

function matchAuthenticationServiceRoute<T extends TwirpContext = TwirpContext>(
  method: string,
  events: RouterEvents<T>
) {
  switch (method) {
    case "Authenticate":
      return async (
        ctx: T,
        service: AuthenticationServiceTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, Empty, AuthenticateRes>[]
      ) => {
        ctx = { ...ctx, methodName: "Authenticate" };
        await events.onMatch(ctx);
        return handleAuthenticateRequest(ctx, service, data, interceptors);
      };
    default:
      events.onNotFound();
      const msg = `no handler found`;
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleAuthenticateRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: AuthenticationServiceTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, Empty, AuthenticateRes>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleAuthenticateJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleAuthenticateProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}
async function handleAuthenticateJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: AuthenticationServiceTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, Empty, AuthenticateRes>[]
) {
  let request: Empty;
  let response: AuthenticateRes;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = Empty.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      Empty,
      AuthenticateRes
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Authenticate(ctx, inputReq);
    });
  } else {
    response = await service.Authenticate(ctx, request!);
  }

  return JSON.stringify(
    AuthenticateRes.toJson(response, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    }) as string
  );
}
async function handleAuthenticateProtobuf<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: AuthenticationServiceTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, Empty, AuthenticateRes>[]
) {
  let request: Empty;
  let response: AuthenticateRes;

  try {
    request = Empty.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      Empty,
      AuthenticateRes
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Authenticate(ctx, inputReq);
    });
  } else {
    response = await service.Authenticate(ctx, request!);
  }

  return Buffer.from(AuthenticateRes.toBinary(response));
}
