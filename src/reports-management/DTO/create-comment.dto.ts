// src/reports-management/dto/create-comment.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string; // The admin's response text
}