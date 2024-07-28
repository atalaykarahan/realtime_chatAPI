import { IsNotEmpty, IsOptional } from 'class-validator';

export class RoomDto {
  @IsOptional()
  readonly room_id?: string;

  @IsNotEmpty()
  readonly created_user_id: string;

  @IsOptional()
  readonly message_count?: string;

  @IsOptional()
  readonly last_message?: string;
}
