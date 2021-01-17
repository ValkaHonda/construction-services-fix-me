import { User } from '../entities/user.entity';
import { UserLoginDTO } from './../auth/models/user-login.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRegisterDTO } from '../auth/models/user-register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { ShowUserDTO } from './models/show-user.dto';
import { Role } from 'src/entities/role.entity';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  // One day we should move those "convert" methods in the ConverterService
  public async convertToShowUserDTO(user: User): Promise<ShowUserDTO> {
    
    const convertedUser: ShowUserDTO = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: (await user.role).name,
      avatarURL: user.avatarURL,
      phone: user.phone,
    };
    return convertedUser;
  }
  private async convertToShowUserDTOArray(users: User[]): Promise<ShowUserDTO[]> {
      return Promise.all(users.map(async (entity: User) => this.convertToShowUserDTO(entity)));
  }

 
  async register(user: UserRegisterDTO): Promise<ShowUserDTO> {
    const newUser: User = this.usersRepository.create(user);

    const passwordHash = await bcrypt.hash(user.password, 10);
    newUser.password = passwordHash;
    const memberRole: Role = await this.rolesRepository.findOne({
      where: {
        name: 'member',
      },
    });
    newUser.role = Promise.resolve(memberRole);
    newUser.avatarURL = 'https://img2.freepng.ru/20180520/iug/kisspng-computer-icons-user-profile-synonyms-and-antonyms-5b013f455c55c1.0171283215268083893782.jpg';
    const savedUser = await this.usersRepository.save(newUser);

    return this.convertToShowUserDTO(savedUser);

    // return plainToClass(ShowUserDTO, savedUser, { excludeExtraneousValues: true });
  }

  async findUserByEmail(email: string): Promise<ShowUserDTO> | undefined {
    const foundUser = await this.usersRepository.findOne({
      where: {
        email,
        isDeleted: false,
      },
    });

    if (!foundUser) {
      return undefined;
    }
    
    return this.convertToShowUserDTO(foundUser);

    // return plainToClass(ShowUserDTO, foundUser, { excludeExtraneousValues: true });
  }

  async validateUserPassword(user: UserLoginDTO): Promise<boolean> {
    const userEntity = await this.usersRepository.findOne({
      where: {
        email: user.email,
        isDeleted: false,
      },
    });

    return await bcrypt.compare(user.password, userEntity.password);
  }

  async findAllUsers(loggedUser: User): Promise<ShowUserDTO[]>{
    const userEntities:User[] = await this.usersRepository.find({
      where: {
        isDeleted: false,
      },
    });

    return this.convertToShowUserDTOArray(userEntities.filter((user)=>user.id !== loggedUser.id));
  }

  async findSingleUser(userId: string): Promise<ShowUserDTO>{
    const userEntity: User = await this.usersRepository.findOne({
      where: {
        id: userId,
        isDeleted: false,
      },
    });
    if (!userEntity) {
      throw new BadRequestException('User with such ID does not exist.');
    }
    return this.convertToShowUserDTO(userEntity);
  }

}
