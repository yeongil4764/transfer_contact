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

  async login(user: any): Promise<any> {
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

    const refreshtoken = this.jwtService.sign(payload, {
      secret: 'REFRESHSECRET',
      expiresIn: '7D',
    });

    const { id } = await this.createRefreshToken(refreshtoken);
    const d = new Date(0);

    return {
      accessToken: accesstoken,
      expireAt: d.setUTCSeconds(this.jwtService.decode(accesstoken)['exp']),
      rtid: id,
      user: payload,
    };
  }

  async exToken(info: { id: number; name: string }): Promise<any> {
    let id: Prisma.TokenWhereUniqueInput;
    id = { id: info.id };
    const res = this.prismaService.token.findUnique({
      where: id,
    });

    if (res) {
      const user = await this.userSerivce.findOne(info.name);
      const payload = { name: user.name, role: user.role };
      const accessToken = this.jwtService.sign(payload);
      const d = new Date(0);

      return {
        accesstoken: accessToken,
        expireAt: d.setUTCSeconds(this.jwtService.decode(accessToken)['exp']),
        user: payload,
      };
    }
  }

  async createRefreshToken(rt: string): Promise<Token> {
    let token: Prisma.TokenCreateInput;
    token = { token: rt };
    return await this.prismaService.token.create({
      data: token,
    });
  }

  async deleteRefreshToken(id: any): Promise<Token> {
    return this.prismaService.token.delete({ where: { id } });
  }
}
