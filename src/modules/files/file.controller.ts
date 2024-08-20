import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
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
import {
  CompleteMultipartUploadCommand,
  ListPartsCommand,
} from '@aws-sdk/client-s3';

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
    await this.fileService.upload(file.originalname, file.buffer);
    return res.sendStatus(HttpStatus.OK);
  }

  //region api/v1/file | post
  @Post('uploadinit')
  async initializeUpload(
    @Body() body: { fileName: string; fileType: string; fileSize: number },
    @Res() res: Response,
  ) {
    console.log('apiye ulaştı aslında');
    const { fileName, fileType, fileSize } = body;
    const uploadId = await this.fileService.initializeMultipartUpload(
      fileName,
      fileType,
    );
    const presignedUrls = await this.fileService.getPresignedUrls(
      uploadId,
      fileName,
      fileSize,
    );

    c;

    return res.status(HttpStatus.OK).json({ uploadId, presignedUrls });
  }

  @Post('complete')
  async completeUpload(
    @Body() completeUploadDto: { fileName: string; uploadId: string },
  ) {
    const { fileName, uploadId } = completeUploadDto;

    try {
      const partsListCommand = new ListPartsCommand({
        Bucket: 'realtime-chat-test',
        Key: fileName,
        UploadId: uploadId,
      });

      const listPartsResponse =
        await this.fileService.s3Client.send(partsListCommand);

      if (listPartsResponse.Parts.length !== 6) {
        throw new HttpException(
          'Tüm parçalar yüklenmedi, yükleme tamamlanamaz.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const completeMultipartUploadCommand = new CompleteMultipartUploadCommand(
        {
          Bucket: 'realtime-chat-test',
          Key: fileName,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: listPartsResponse.Parts.map((part) => ({
              ETag: part.ETag,
              PartNumber: part.PartNumber,
            })),
          },
        },
      );

      await this.fileService.s3Client.send(completeMultipartUploadCommand);

      // Yükleme tamamlandıktan sonra, veritabanında gerekli güncellemeleri yapabilirsin
      // await this.filesService.updateFileRecord(...);

      return { message: 'Dosya yüklemesi başarıyla tamamlandı.' };
    } catch (error) {
      console.error('Multipart yükleme tamamlama hatası:', error);
      throw new BadRequestException('Yükleme tamamlama sırasında hata oluştu.');
    }
  }
}
