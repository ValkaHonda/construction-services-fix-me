import { UsersService } from "./../users/users.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserLoginDTO } from "./models/user-login.dto";
import { UserRegisterDTO } from "./models/user-register.dto";
import { ShowUserDTO } from "../users/models/show-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(
    user: UserLoginDTO,
  ): Promise<{ user: ShowUserDTO; token: string }> {
    const userFound = await this.usersService.findUserByEmail(user.email);

    if (!userFound) {
      return undefined;
    }
    const token = await this.jwtService.sign({
      id: userFound.id,
      email: userFound.email,
      username: userFound.username,
      role: userFound.role,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      avatarURL: userFound.avatarURL,
      phone: userFound.phone
    });
    return { user: userFound, token };
    // const payload = {email: user.email};

    // return await this.jwtService.signAsync(payload);
  }

  async register(user: UserRegisterDTO): Promise<ShowUserDTO> {
    return await this.usersService.register(user);
  }

  async validateIfUserExists(email: string): Promise<ShowUserDTO> | undefined {
    return await this.usersService.findUserByEmail(email);
  }

  async validateUserPassword(user: UserLoginDTO): Promise<boolean> {
    return await this.usersService.validateUserPassword(user);
  }
}
