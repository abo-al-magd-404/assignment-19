import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { CloudinaryService } from './common/service';
import type { Request, Response } from 'express';

const cloudinaryWriteStream = promisify(pipeline);

@Controller()
export class AppController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('uploads/*path')
  async getFile(@Req() req: Request, @Res() res: Response) {
    const { download, filename } = req.query as {
      download?: string;
      filename?: string;
    };
    const { path } = req.params as { path: string[] };
    const key = path.join('/');
    const { body: Body, contentType: ContentType } =
      await this.cloudinaryService.getAsset({
        key,
      });
    res.setHeader('Content-Type', ContentType || 'application/octet-stream');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    if (download == 'true') {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename || path.pop()}"`,
      );
    }
    return await cloudinaryWriteStream(Body, res);
  }

  @Get('pre-signed/*path')
  async getFileLink(@Req() req: Request) {
    const { download, filename } = req.query as {
      download?: string;
      filename?: string;
    };
    const { path } = req.params as { path: string[] };
    const key = path.join('/');

    return await this.cloudinaryService.createPresignedFetchLink({
      key,
      download: download === 'true',
      fileName: filename,
    });
  }
}
