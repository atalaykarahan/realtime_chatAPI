import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { RequestStatus } from '../../../enum';

export class RequestDto {
  @IsOptional()
  readonly request_id?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly sender_mail: string;

  @IsEmail()
  @IsNotEmpty()
  readonly receiver_mail: string;

  @IsEnum(RequestStatus)
  @IsOptional()
  message_read_status?: RequestStatus = RequestStatus.pending;
}
