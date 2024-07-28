import { IsNotEmpty } from 'class-validator';

export class UserRoomDto {
  @IsNotEmpty()
  readonly user_id: string;

  @IsNotEmpty()
  readonly room_id?: string;
}
