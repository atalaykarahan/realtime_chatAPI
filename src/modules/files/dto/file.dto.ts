import { IsNotEmpty, IsOptional } from 'class-validator';

export class FileDto {
  @IsOptional()
  readonly file_id?: string;
  @IsNotEmpty()
  readonly room_id: string;
  @IsNotEmpty()
  readonly sender_id: string;
  @IsNotEmpty()
  readonly file_name: string;
  @IsNotEmpty()
  readonly file_byte: string;
  @IsOptional()
  readonly message_id?: string;
  @IsOptional()
  readonly file_type?: string;
}
