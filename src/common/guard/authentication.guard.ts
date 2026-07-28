import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../service';
import { IAuthReq } from '../interfaces';
import { Reflector } from '@nestjs/core';
import { TokenTypeEnum } from '../enum';
import { tokenTypeName } from '../decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log(context);
    // console.log({
    //   type: context.getType(),
    //   handler: context.getHandler(),
    //   class: context.getClass(),
    // });

    const tokenType =
      this.reflector.getAllAndOverride<TokenTypeEnum>(tokenTypeName, [
        context.getHandler(),
        context.getClass(),
      ]) ?? TokenTypeEnum.ACCESS;

    console.log({ tokenType });

    let req!: IAuthReq;
    let authorization!: string;

    switch (context.getType()) {
      case 'http':
        req = context.switchToHttp().getRequest();
        authorization = req.headers['authorization'] as string;
        break;

      // case 'ws':
      //   req = context.switchToWs().getClient();
      //   authorization = req.headers['authorization'] as string;
      //   break;

      default:
        break;
    }

    const [key, credential] = authorization?.split(' ') || [];

    // console.log({ key, credential });

    if (!key || !credential) {
      throw new UnauthorizedException('missing authorization');
    }

    switch (key) {
      case 'Basic':
        {
          const [username, password] = Buffer.from(credential, 'base64')
            .toString()
            .split(':');

          // console.log({ username, password });
        }
        break;

      default: {
        req.credentials = await this.tokenService.decodeToken({
          token: credential,
          tokenType,
        });

        break;
      }
    }

    return true;
  }
}
