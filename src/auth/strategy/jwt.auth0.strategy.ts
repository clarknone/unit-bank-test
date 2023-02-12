import { IAuthGuard, PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class Auth0Strategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor() {
    console.log({ke:process.env.AUTH_DOMAIN})
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
        jwksUri: `${process.env.AUTH_DOMAIN}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // aud: 'http://localhost:8000',
      // issuer: `${process.env.AUTH_DOMAIN}`,
      algorithms: ['RS256'],
    });
  }


  async validate(params: any) {
    console.log({ params });
    // if (params?.id) {
    //   params.id = new Types.ObjectId(params.id);
    // }
    return params;
  }
}
