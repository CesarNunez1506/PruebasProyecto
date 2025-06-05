import { Session } from '../../../session/domain/session';
import { User } from '../../../users/domain/user';
import { UserType } from '../../../users/domain/enums/user-type.enum';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  userType?: UserType; // Optional as existing tokens might not have it
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
