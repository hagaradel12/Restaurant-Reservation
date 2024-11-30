import { UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();


export function AuthenticationMiddleware(req:Request, res:Response, next:NextFunction){
    const token = req.cookies?.token|| req.headers['authorization']?.split(' ')[1];
        if(!token){
            throw new UnauthorizedException('Authentication token missing');
        }
        try{
            const decoded: any = verify(token , String(process.env.JWT_SECRET));
            req['user']= decoded.user;
            next();
        }catch(err){
            throw new UnauthorizedException('Invalid or expired token');
        }

}


