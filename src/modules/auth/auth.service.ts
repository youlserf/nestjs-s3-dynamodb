import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async validateToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(process.env.AUTH_REST_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
