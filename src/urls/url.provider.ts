import { CreateUrlService } from './services/create.service';
import { findUrlsByUserId } from './services/find-urls-by-user-id.service';
import { UpdateService } from './services/update.service';
import { DeleteService } from './services/delete.service';
import { FindByShortCode } from './services/find-by-short-code.service';
import { RedirectService } from './services/redirect.service';

export const UrlProviders = [
  CreateUrlService,
  findUrlsByUserId,
  UpdateService,
  FindByShortCode,
  DeleteService,
  RedirectService,
];
