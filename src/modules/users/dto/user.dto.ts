import {
  IsDate,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

enum Authority {
  GUEST = '1',
  ADMIN = '2',
  USER = '3',
}

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
  // @IsNotEmpty()
  // @IsDate()
  // readonly createdAt: Date;
  // @IsNotEmpty()
  // @IsDate()
  // readonly updatedAt: Date;
  // @IsOptional()
  // @IsDate()
  // readonly deletedAt: Date;
}
