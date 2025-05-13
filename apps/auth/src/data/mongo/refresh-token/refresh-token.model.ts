import { Guid } from "@app/shared";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    collection: "refresh_tokens",
    timestamps: true
})
export class RefreshToken {
    @Prop({ type: String, default: Guid.NewGuid() })
    _id: string

    @Prop({ type: String, required: true })
    userId: string

    @Prop({ type: String, required: true })
    deviceId: string

    @Prop({ type: String, required: true })
    ipAddress: string

    @Prop({ type: Date, required: true })
    expiresAt: Date

    @Prop({ type: Date, default: null })
    revokedAt: Date | null
}

export type RefreshTokenDocument = HydratedDocument<RefreshToken> & {
    createdAt: Date,
    updatedAt: Date,
}
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);