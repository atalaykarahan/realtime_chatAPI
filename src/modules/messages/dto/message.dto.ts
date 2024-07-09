import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { READ_STATUS, ReadStatus } from "src/enum";


export class MessageDto{
    @IsOptional()
    readonly message_id: string;
    @IsNotEmpty()
    @MaxLength(10_000)
    readonly message_content: string;
    @IsNotEmpty()
    readonly message_sender_id: string;
    @IsNotEmpty()
    readonly message_receiver_id: string;
    @IsNotEmpty()
    @IsEnum(READ_STATUS)
    readonly message_read_status: ReadStatus;
}