import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ValidSession } from '../../core/guards/validSession.guard';
import { Response } from 'express';
import { RequestStatus } from '../../enum';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestsService) {}

  // api/v1/request
  //#region SEND FRIEND REQUEST | post
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

  // api/v1/request | get
  //#region GET FRIEND REQUEST
  @UseGuards(ValidSession)
  @Get()
  async getRequest(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const requests = await this.requestService.getComingByEmail(
      session.user.mail,
    );

    if (!requests)
      throw new HttpException('Request not found', HttpStatus.NO_CONTENT);

    return res.status(HttpStatus.OK).json(requests);
  }

  //#endregion

  // api/v1/request | patch
  //#region UPDATE FRIENDSHIP REQUEST
  @UseGuards(ValidSession)
  @Patch()
  async patchAcceptRequest(
    @Body() body: { sender_mail: string; status: RequestStatus },
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    if (!body.sender_mail || !body.status)
      throw new HttpException(
        'sender mail or status does not exists',
        HttpStatus.BAD_REQUEST,
      );

    const accept = await this.requestService.updateFriendshipRequest(
      body.sender_mail,
      session.user.mail,
      body.status,
    );
    if (!accept)
      throw new HttpException(
        'Request could not be accept',
        HttpStatus.BAD_REQUEST,
      );

    return res.sendStatus(HttpStatus.OK);
  }

  //#endregion
}
