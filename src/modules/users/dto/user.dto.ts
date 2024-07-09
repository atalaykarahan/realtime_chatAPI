import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  readonly user_id: string;
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  readonly user_email: string;
  @IsNotEmpty()
  @MaxLength(10)
  readonly user_name: string;
  @IsOptional()
  readonly user_photo: string;
  @IsOptional()
  readonly user_role?: string;
}
