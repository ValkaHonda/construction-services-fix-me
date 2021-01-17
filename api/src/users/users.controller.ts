import { AuthGuard } from '@nestjs/passport';
import { ShowUserDTO } from './models/show-user.dto';
import { 
    Controller,
    Param, 
    UseGuards,
    Get, 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { SessionUser } from '../decorators/session-user.decorator';

@UseGuards(AuthGuard())
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
  ) {}

    @Get()
    async findAll(
      @SessionUser() user: User
    ): Promise<ShowUserDTO[]> {
        return this.userService.findAllUsers(user);
    }

    @Get(':userId')
    async findSingleUser(
      @Param('userId') userId: string,
    ): Promise<ShowUserDTO> {
      return this.userService.findSingleUser(userId);
    }
}
