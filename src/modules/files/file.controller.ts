import {
  Body,
  Controller,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ValidSession } from '../../core/guards/validSession.guard';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private fileService: FilesService) {}

  //region api/v1/file | post
  @UseGuards(ValidSession)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2147483648 })],
      }),
    )
    file: Express.Multer.File,
    @Body('message') message: string,
    @Res()
    res: Response,
    @Session() session: Record<string, any>,
  ) {
    console.log('file yüklenmiş olmalı illaki', file);
    await this.fileService.upload(file.originalname, file.buffer, file.size);
    return res.sendStatus(HttpStatus.OK);
  }
}
