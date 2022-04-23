// @generated by protobuf-ts 2.2.3-alpha.1 with parameter client_none,generate_dependencies
// @generated from protobuf file "proto/auth/authorizqation.proto" (package "user", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Date } from "../common/date";
/**
 * 実際はここに認証情報がはいる
 *
 * @generated from protobuf message user.AuthorizeReq
 */
export interface AuthorizeReq {
}
/**
 * @generated from protobuf message user.AuthorizeRes
 */
export interface AuthorizeRes {
    /**
     * @generated from protobuf field: common.Date authenticatedAt = 1;
     */
    authenticatedAt?: Date;
}
// @generated message type with reflection information, may provide speed optimized methods
class AuthorizeReq$Type extends MessageType<AuthorizeReq> {
    constructor() {
        super("user.AuthorizeReq", []);
    }
    create(value?: PartialMessage<AuthorizeReq>): AuthorizeReq {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<AuthorizeReq>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AuthorizeReq): AuthorizeReq {
        return target ?? this.create();
    }
    internalBinaryWrite(message: AuthorizeReq, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message user.AuthorizeReq
 */
export const AuthorizeReq = new AuthorizeReq$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AuthorizeRes$Type extends MessageType<AuthorizeRes> {
    constructor() {
        super("user.AuthorizeRes", [
            { no: 1, name: "authenticatedAt", kind: "message", T: () => Date }
        ]);
    }
    create(value?: PartialMessage<AuthorizeRes>): AuthorizeRes {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<AuthorizeRes>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AuthorizeRes): AuthorizeRes {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* common.Date authenticatedAt */ 1:
                    message.authenticatedAt = Date.internalBinaryRead(reader, reader.uint32(), options, message.authenticatedAt);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: AuthorizeRes, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* common.Date authenticatedAt = 1; */
        if (message.authenticatedAt)
            Date.internalBinaryWrite(message.authenticatedAt, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message user.AuthorizeRes
 */
export const AuthorizeRes = new AuthorizeRes$Type();
/**
 * @generated ServiceType for protobuf service user.AuthorizationService
 */
export const AuthorizationService = new ServiceType("user.AuthorizationService", [
    { name: "Authorize", options: {}, I: AuthorizeReq, O: AuthorizeRes }
]);
