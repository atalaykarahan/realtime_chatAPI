import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { FriendStatus } from '../../../enum';

export class FriendDto {
  @IsOptional()
  readonly friend_id?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly user_mail: string;

  @IsEmail()
  @IsNotEmpty()
  readonly user_mail2: string;

  @IsEnum(FriendStatus)
  @IsOptional()
  readonly friend_status?: FriendStatus = FriendStatus.friend;
}
