import { JwtPayload } from './../interfaces/jwt-payload';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '../../config/config.service';
import { ShowUserDTO } from '../../users/models/show-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<ShowUserDTO> {
    const user = await this.authService.validateIfUserExists(payload.email);
  

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
