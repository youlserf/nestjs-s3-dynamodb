import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AuthService, AuthGuard], 
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
