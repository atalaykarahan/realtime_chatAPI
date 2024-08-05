import { Body, Inject, Injectable } from '@nestjs/common';
import { FILE_REPOSITORY, SEQUELIZE } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: typeof File,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {}

  async upload(fileName: string, file: Buffer, fileSize: number) {
    try {
      if (fileSize <= 314572800) {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: 'realtime-chat-test',
            Key: fileName,
            Body: file,
          }),
        );
      } else {
        const uploadId = await this.createMultipartUpload(fileName);
        const parts = await this.uploadParts(file, uploadId, fileName);
        console.log('bu upload id', uploadId);
        console.log('burasıda part', parts);
        await this.completeMultipartUpload(uploadId, fileName, parts);
      }
    } catch (e) {
      console.error('s3 aktarımında hata', e);
    }
  }

  private async createMultipartUpload(fileName: string) {
    const command = new CreateMultipartUploadCommand({
      Bucket: 'realtime-chat-test',
      Key: fileName,
    });

    const { UploadId } = await this.s3Client.send(command);
    return UploadId;
  }

  private async uploadParts(file: Buffer, uploadId: string, fileName: string) {
    const partSize = 5 * 1024 * 1024; // 5 MB
    const numParts = Math.ceil(file.length / partSize);
    const parts = [];

    for (let partNumber = 1; partNumber <= numParts; partNumber++) {
      const start = (partNumber - 1) * partSize;
      const end = Math.min(file.length, partNumber * partSize);
      const partData = file.slice(start, end);
      const command = new UploadPartCommand({
        Bucket: 'realtime-chat-test',
        Key: fileName,
        PartNumber: partNumber,
        UploadId: uploadId,
        Body: partData,
      });

      const { ETag } = await this.s3Client.send(command);
      parts.push({ ETag, PartNumber: partNumber });
    }

    return parts;
  }

  private async completeMultipartUpload(
    uploadId: string,
    fileName: string,
    parts: { ETag: string; PartNumber: number }[],
  ) {
    const command = new CompleteMultipartUploadCommand({
      Bucket: 'realtime-chat-test',
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });

    await this.s3Client.send(command);
  }
}
