import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from './auth-request.interface';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or malformed Authorization header');
      throw new UnauthorizedException('Invalid or missing authentication token');
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    try {
      const decoded = this.jwtService.verify(token, { secret: 'your_secret_key' });
      console.log('Decoded JWT Payload:', decoded);

      request.user = decoded; // Set the user in the request
      return true;
    } catch (error: any) {
      console.log('JWT Verification Failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
