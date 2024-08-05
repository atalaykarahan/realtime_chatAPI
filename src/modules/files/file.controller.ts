import { Controller } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FilesService) {}
}
