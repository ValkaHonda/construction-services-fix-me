import { AuthGuard } from '@nestjs/passport';
import { ShowUserDTO } from './models/show-user.dto';
import { 
    Controller,
    Param, 
    UseGuards,
    Get,
    Post,
    Body,
    UseInterceptors,
    UploadedFiles, 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { SessionUser } from '../decorators/session-user.decorator';
import { ShowServiceDTO } from './models/show-sevice.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

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


    @Post('company')
    async createCompany( @SessionUser() user: User,
    @Body() companyData: any
    ): Promise<{id: string}> { 
        return this.userService.createCompany(companyData, user);
    }


    @Post('company/images/:companyId')
    @UseInterceptors(FilesInterceptor('files[]',20, {dest: './public'} ))
    async attachImagesToCompany( @SessionUser() user: User,
    @Param('companyId') companyId: string,
    @UploadedFiles() files
    ): Promise<{id: string}> { 
        // return this.userService.createCompany(companyData, user);
        console.log({files, companyId });
        
        return {id: 'honda'}
    }

    @Get('services')
    async findAllServices(
    ): Promise<ShowServiceDTO[]> { 
        return this.userService.findAllServices();
    }

    @Get(':userId')
    async findSingleUser(
      @Param('userId') userId: string,
    ): Promise<ShowUserDTO> {
      return this.userService.findSingleUser(userId);
    }
}
