import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ReadStatus } from 'src/enum';

export class MessageDto {
  @IsOptional()
  readonly message_id?: string;
  @IsNotEmpty()
  readonly room_id: string;
  @IsEnum(ReadStatus)
  @IsOptional()
  readonly message_status?: ReadStatus = ReadStatus.unread;
  @IsNotEmpty()
  @MaxLength(10_000)
  readonly message: string;
  @IsNotEmpty()
  readonly sender_id: string;
}
