import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class MovieEntity {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: [String], required: true })
  genres!: string[];

  @Prop({ type: Number, required: false })
  year?: number;

  @Prop({ type: Number, required: true, min: 0, max: 10 })
  rating!: number;

  @Prop({ type: String, required: false })
  original_language?: string;
}
export const MovieSchema = SchemaFactory.createForClass(MovieEntity);

@Schema({ _id: false })
export class ChatMessageEntity {
  @Prop({ type: String, required: true, enum: ['user', 'assistant', 'system'] })
  role!: 'user' | 'assistant' | 'system';

  @Prop({ type: String, required: true })
  content!: string;

  @Prop({ type: [MovieSchema], default: undefined })
  movies?: MovieEntity[];

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessageEntity);

@Schema({ timestamps: true })
export class ChatSessionEntity {
  @Prop({ type: String, required: true, unique: true, trim: true })
  sessionId!: string;

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages!: ChatMessageEntity[];
}

export type ChatSessionDocument = HydratedDocument<ChatSessionEntity>;
export const ChatSessionSchema = SchemaFactory.createForClass(ChatSessionEntity);
