import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Convenience guard that triggers the 'jwt' Passport strategy.
 * Apply to controllers/routes that require authentication:
 *
 *   @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
