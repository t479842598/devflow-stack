import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super();
    void auth;
  }

  async validate(username: string, password: string): Promise<any> {
    const result = await (this.auth as any).login({
      username,
      password,
    } as any);
    return result.user;
  }
}
