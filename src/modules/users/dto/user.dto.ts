import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

enum Authority {
  GUEST = '1',
  ADMIN = '2',
  USER = '3',
}

export class UserDto {
  readonly user_id: string;
  @IsNotEmpty()
  readonly user_name: string;
  @IsNotEmpty()
  @MinLength(3)
  readonly user_password: string;
  @IsEmail()
  @IsOptional()
  readonly user_email: string;
  @IsEnum(Authority, {
    message: 'authority_id must be 1, 2 or 3',
  })
  @IsOptional()
  readonly user_authority_id: string;
  readonly user_email_verified: boolean;
  readonly user_google_id: string;
  readonly user_visibility: boolean;
  readonly user_library_visibility: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
