import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';
import { UrlDTO } from './dtos/url';
import { CreateUrlService } from './services/create.service';
import { findUrlsByUserId } from './services/find-urls-by-user-id.service';
import { UpdateService } from './services/update.service';
import { DeleteService } from './services/delete.service';
import { RedirectService } from './services/redirect.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

export const OptionalAuth = () => SetMetadata('auth:optional', true);

@ApiTags('URLs')
@ApiBearerAuth('access-token')
@Controller()
export class UrlsController {
  constructor(
    private readonly createUrlService: CreateUrlService,
    private readonly findUrlsByUser: findUrlsByUserId,
    private readonly updateService: UpdateService,
    private readonly deleteService: DeleteService,
    private readonly redirectService: RedirectService,
  ) {}

  @Post('/shorten')
  @OptionalAuth()
  @UseGuards(AuthGuard)
  async shorten(@Body() body: UrlDTO, @Req() req: Request) {
    const userId = (req as any)?.user?.id;
    return this.createUrlService.execute(body.url, userId as string);
  }

  @Get('/urls')
  @UseGuards(AuthGuard)
  async findUrlsByUserId(@Req() req: Request) {
    const userId = (req as any)?.user?.id;

    return await this.findUrlsByUser.execute(userId as string);
  }

  @Put('urls/:shortCode')
  @ApiBody({ type: UrlDTO })
  @UseGuards(AuthGuard)
  async update(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Body() body: UrlDTO,
  ) {
    const userId = (req as any)?.user?.id;
    return await this.updateService.execute(
      shortCode,
      userId as string,
      body.url,
    );
  }

  @Delete('urls/:shortCode')
  @UseGuards(AuthGuard)
  async remove(@Param('shortCode') shortCode: string, @Req() req: Request) {
    const userId = (req as any)?.user?.id;
    return await this.deleteService.execute(shortCode, userId as string);
  }

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const originalUrl = await this.redirectService.execute(shortCode);
    return res.redirect(originalUrl);
  }
}
