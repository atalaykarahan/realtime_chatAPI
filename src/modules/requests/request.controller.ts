import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ValidSession } from '../../core/guards/validSession.guard';
import { Response } from 'express';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestsService) {}

  // api/v1/auth/login
  //#region SEND FRIEND REQUEST
  @UseGuards(ValidSession)
  @Post()
  async sendRequest(
    @Body() body: { receiver_mail: string },
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const friendRequest = await this.requestService.create({
      sender_mail: session.user.mail,
      receiver_mail: body.receiver_mail,
    });

    if (!friendRequest)
      throw new HttpException(
        'Friend request could not be send',
        HttpStatus.BAD_REQUEST,
      );

    return res.sendStatus(HttpStatus.CREATED);
  }
  //#endregion
}
