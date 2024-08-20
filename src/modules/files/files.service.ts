import { Inject, Injectable } from '@nestjs/common';
import { FILE_REPOSITORY, SEQUELIZE } from 'src/core/constants';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import {
  CreateMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FilesService {
  public s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: typeof File,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {}

  async upload(fileName: string, file: Buffer) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'realtime-chat-test',
          Key: fileName,
          Body: file,
        }),
      );
    } catch (e) {
      console.error('s3 aktarımında hata', e);
    }
  }

  async initializeMultipartUpload(fileName: string, fileType: string) {
    const params = {
      Bucket: 'realtime-chat-test',
      Key: fileName,
      ContentType: fileType,
    };

    const command = new CreateMultipartUploadCommand(params);
    const upload = await this.s3Client.send(command);
    return upload.UploadId;
  }

  async getPresignedUrls(uploadId: string, fileName: string, fileSize: number) {
    const partCount = 6; // Her zaman 6 parçaya böleceğiz
    const chunkSize = Math.ceil(fileSize / partCount); // Dinamik olarak chunk boyutunu belirle

    const urls = [];
    for (let i = 1; i <= partCount; i++) {
      const command = new UploadPartCommand({
        Bucket: 'realtime-chat-test',
        Key: fileName,
        PartNumber: i,
        UploadId: uploadId,
      });
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      urls.push({ partNumber: i, url, chunkSize }); // chunkSize'ı da döndürüyoruz
    }
    return urls;
  }
}
