import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { RoomType } from '../../../enum';

export class RoomDto {
  @IsOptional()
  readonly room_id?: string;

  @IsNotEmpty()
  readonly created_user_id: string;

  @IsOptional()
  readonly message_count?: string;

  @IsOptional()
  readonly last_message?: string;

  @IsEnum(RoomType)
  @IsOptional()
  readonly room_type?: RoomType = RoomType.private;
}
