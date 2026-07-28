import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthReq } from '../interfaces';
import { Reflector } from '@nestjs/core';
import { RoleEnum, TokenTypeEnum } from '../enum';
import { roleName } from '../decorator';
import { HydratedUserDocument } from 'src/model';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log(context);
    // console.log({
    //   type: context.getType(),
    //   handler: context.getHandler(),
    //   class: context.getClass(),
    // });

    const roles =
      this.reflector.getAllAndOverride<RoleEnum[]>(roleName, [
        context.getHandler(),
        context.getClass(),
      ]) ?? TokenTypeEnum.ACCESS;

    let user!: HydratedUserDocument;

    switch (context.getType()) {
      case 'http':
        user = (context.switchToHttp().getRequest() as IAuthReq).credentials
          .user;
        break;

      default:
        break;
    }

    return roles.includes(user.role);
  }
}
