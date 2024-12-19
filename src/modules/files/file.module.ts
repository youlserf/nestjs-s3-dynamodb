import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AwsService } from 'src/config/aws.config';
import { AuthModule } from '../auth/auth.module';
import { FilesController } from './file.controller';
import { FilesService } from './file.service';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, AwsService],
})
export class FilesModule {}
