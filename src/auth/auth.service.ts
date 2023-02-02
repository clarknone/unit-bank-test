import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/create-auth.dto';
import { IAuthUser } from './interfaces/auth.interface';
import { IErrorResponse } from './interfaces/response.interface';
import { User, UserDocument } from './schema/auth.schema';
import * as bcrypt from 'bcrypt';
import { parseDBError } from 'src/helper/main';
import { ServiceException } from 'src/helper/exceptions/exceptions/service.layer.exception';
import { JwtService } from '@nestjs/jwt';
import { bruteForceCheck } from './helpers/services/auth.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserSchema: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignUpDto): Promise<IAuthUser> {
    return this.UserSchema.find({ email: data.email })
      .then(async (users) => {
        if (users.length) {
          throw new ServiceException({ error: 'email already exist' });
        }
        const user = new this.UserSchema({ ...data });
        const password = await bcrypt.hash(user.password, 10);
        user.password = password;
        await user.save();
        return this.signUser(user);
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async signin(data: SignInDto): Promise<IAuthUser> {
    return this.UserSchema.findOne({ email: data.email })
      .then(async (user) => {
        if (!user) {
          throw new ServiceException({ error: 'User not found' });
        }
        if (!(await bruteForceCheck(user))) {
          throw new ServiceException({
            error: 'Too many attempts, Try again in five minutes',
          });
        }

        if (await bcrypt.compare(data.password, user.password)) {
          user.attempt = 0;
          await user.save();
          return this.signUser(user);
        }
        throw new ServiceException({ error: 'incorrect password' });
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async refreshToken(data: RefreshTokenDto): Promise<IAuthUser> {
    return this.UserSchema.findOne({ refreshToken: data.refreshToken })
      .then((user) => {
        console.log(user);
        if (!user) {
          throw new ServiceException({
            error: 'invalid refresh token',
            status: 401,
          });
        }
        if (!user.isActive) {
          throw new ServiceException({ error: 'session expired', status: 401 });
        }
        return this.signUser(user);
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async forgotPassword(data: ForgotPasswordDto) {}
  async resetPassword(data: ResetPasswordDto) {}

  async logout(authUser: IAuthUser): Promise<void> {
    this.UserSchema.findByIdAndUpdate(authUser.id, { isActive: false }).catch(
      (e) => {
        throw new ServiceException({ error: parseDBError(e) });
      },
    );
  }

  async signUser(user: UserDocument): Promise<IAuthUser> {
    const token: string = this.jwtService.sign(
      {
        email: user.email,
        type: user.type,
        id: user._id,
      },
      { expiresIn: '45hr' },
      // { expiresIn: '15min' },
    );

    const refreshToken: string = this.jwtService.sign(
      {
        email: user.email,
        id: user._id,
      },
      { expiresIn: '3d' },
    );

    const authUser: IAuthUser = {
      token,
      refreshToken,
      email: user.email,
      id: user._id,
      type: user.type,
      fullName: user.fullname,
    };
    user.refreshToken = refreshToken;
    user.isActive = true;
    await user.save();

    return authUser;
  }
}
