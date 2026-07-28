import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HydratedUserDocument } from 'src/model';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let user!: HydratedUserDocument;

    switch (context.getType()) {
      case 'http':
        user = context.switchToHttp().getRequest().credentials.user;
        break;

      // case 'ws':
      //   req = context.switchToWs().getClient();
      //   authorization = req.headers['authorization'] as string;
      //   break;

      default:
        break;
    }

    return user;
  },
);
