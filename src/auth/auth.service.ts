import { Prisma, Token } from '.prisma/client';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userSerivce: UserService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.userSerivce.findOne(name);
    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  async login(user: any, rtcheck: boolean): Promise<any> {
    const { name, password } = user;
    const userinfo = await this.prismaService.user.findUnique({
      where: { name },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const passwordValid = (await password) === userinfo.password;
    if (!passwordValid) {
      throw new UnauthorizedException();
    }

    delete user.password;

    const payload = { name: user.name, role: user.role };

    const accesstoken = this.jwtService.sign(payload);
    
    if(!rtcheck) {
      return {
        accesstoken: accesstoken,
        exireAt: this.jwtService.decode(accesstoken)['exp'],
        user: payload,
      }

    } else {
      const refreshtoken = this.jwtService.sign(payload, {
        secret: 'REFRESHSECRET',
        expiresIn: '7D',
      });
  
      const { id } = await this.createRefreshToken(refreshtoken);
      
      return {
        accessToken: accesstoken,
        expireAt: this.jwtService.decode(accesstoken)['exp'],
        rtid: id,
        user: payload,
      };
    }
  }

  //리프레쉬 토큰이 들어오면 접근토큰을 재발급 해주는 함수가 필요함.


  async createRefreshToken(rt: string): Promise<Token> {
    let token: Prisma.TokenCreateInput;
    token = { token: rt };
    return await this.prismaService.token.create({
      data: token,
    });
  }

  async deleteRefreshToken(id): Promise<Token> {
    return this.prismaService.token.delete({ where: { id } });
  }
}
