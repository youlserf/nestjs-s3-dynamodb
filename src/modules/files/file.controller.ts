import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { FilesService } from './file.service';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    console.log('Received file:', file); 
    if (!file) {
      throw new Error('No file uploaded');
    }
    const userId = req.user.userId;
    return this.filesService.uploadFile(file, userId);
  }

  @Post('download')
  async downloadFile(@Request() req: any, @Body('fileId') fileId: string) {
    if (!fileId) {
      throw new Error('No fileId provided');
    }
    return this.filesService.getFile(fileId);
  }

  @Get('list')
  async listUserFiles(@Request() req: any) {
    const userId = req.user.userId;
    const files = await this.filesService.getUserFiles(userId);
    return { files };
  }
}
