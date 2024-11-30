import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
dotenv.config();
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate{

    constructor (private jwtService: JwtService, private reflector: Reflector){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[
            context.getHandler(),
            context.getClass(),
        ]);
        if(isPublic){
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException('please login');
        }
        try{
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret:process.env.JWT_SECRET
                }
            );
            request['user']=payload;
        }
        catch{
            throw new UnauthorizedException('invalid token');
        }
        return true;
    }
    extractTokenFromHeader(request: Request): string | undefined{
        const token = request.cookies?.token || request.headers['authorization']?.split(' ')[1];

        return token;
    }

    
    
}