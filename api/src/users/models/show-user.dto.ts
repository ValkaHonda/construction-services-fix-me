import { Expose } from 'class-transformer';
import { Role } from 'src/entities/role.entity';

export class ShowUserDTO {

  // Should we expose the ID ???
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: string;

  @Expose()
  avatarURL: string;

  @Expose()
  phone: string;
}
