import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      return false;  
    }

    const userData = await this.authService.validateToken(token); 
    if (!userData) {
      return false; 
    }

    request.user = userData;  
    return true;  
  }

  private extractToken(request): string | null {
    const authorization = request.headers['authorization'];
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.slice(7); 
    }
    return null;
  }
}
