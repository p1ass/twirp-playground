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
import { GetUserReq, GetUserRes } from "./user";

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

export interface UserServiceClient {
  GetUser(request: GetUserReq): Promise<GetUserRes>;
}

export class UserServiceClientJSON implements UserServiceClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GetUser.bind(this);
  }
  GetUser(request: GetUserReq): Promise<GetUserRes> {
    const data = GetUserReq.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "user.UserService",
      "GetUser",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      GetUserRes.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }
}

export class UserServiceClientProtobuf implements UserServiceClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GetUser.bind(this);
  }
  GetUser(request: GetUserReq): Promise<GetUserRes> {
    const data = GetUserReq.toBinary(request);
    const promise = this.rpc.request(
      "user.UserService",
      "GetUser",
      "application/protobuf",
      data
    );
    return promise.then((data) => GetUserRes.fromBinary(data as Uint8Array));
  }
}

//==================================//
//          Server Code             //
//==================================//

export interface UserServiceTwirp<T extends TwirpContext = TwirpContext> {
  GetUser(ctx: T, request: GetUserReq): Promise<GetUserRes>;
}

export enum UserServiceMethod {
  GetUser = "GetUser",
}

export const UserServiceMethodList = [UserServiceMethod.GetUser];

export function createUserServiceServer<T extends TwirpContext = TwirpContext>(
  service: UserServiceTwirp<T>
) {
  return new TwirpServer<UserServiceTwirp, T>({
    service,
    packageName: "user",
    serviceName: "UserService",
    methodList: UserServiceMethodList,
    matchRoute: matchUserServiceRoute,
  });
}

function matchUserServiceRoute<T extends TwirpContext = TwirpContext>(
  method: string,
  events: RouterEvents<T>
) {
  switch (method) {
    case "GetUser":
      return async (
        ctx: T,
        service: UserServiceTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, GetUserReq, GetUserRes>[]
      ) => {
        ctx = { ...ctx, methodName: "GetUser" };
        await events.onMatch(ctx);
        return handleGetUserRequest(ctx, service, data, interceptors);
      };
    default:
      events.onNotFound();
      const msg = `no handler found`;
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleGetUserRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: UserServiceTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetUserReq, GetUserRes>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleGetUserJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleGetUserProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}
async function handleGetUserJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: UserServiceTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetUserReq, GetUserRes>[]
) {
  let request: GetUserReq;
  let response: GetUserRes;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = GetUserReq.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      GetUserReq,
      GetUserRes
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.GetUser(ctx, inputReq);
    });
  } else {
    response = await service.GetUser(ctx, request!);
  }

  return JSON.stringify(
    GetUserRes.toJson(response, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    }) as string
  );
}
async function handleGetUserProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: UserServiceTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetUserReq, GetUserRes>[]
) {
  let request: GetUserReq;
  let response: GetUserRes;

  try {
    request = GetUserReq.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      GetUserReq,
      GetUserRes
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.GetUser(ctx, inputReq);
    });
  } else {
    response = await service.GetUser(ctx, request!);
  }

  return Buffer.from(GetUserRes.toBinary(response));
}
