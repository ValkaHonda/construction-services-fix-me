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
import { diskStorage } from 'multer';
import { extname } from 'path';

const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 10).toString(10))
    .join('');
  callback(null, `${name}${randomName}${fileExtName}`);
};

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

    @Get('company')
    async getAllCompanies(
    ): Promise<any> { 
        return this.userService.getAllCompanies()
    }

    @Post('company')
    async createCompany( @SessionUser() user: User,
    @Body() companyData: any
    ): Promise<{id: string}> { 
        return this.userService.createCompany(companyData, user);
    }


    @Post('company/images/:companyId')
    @UseInterceptors(FilesInterceptor('files[]',20, {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      })
    } ))
    async attachImagesToCompany( @SessionUser() user: User,
    @Param('companyId') companyId: string,
    @UploadedFiles() files
    ): Promise<{id: string}> { 
        await this.userService.attachImagesToCompany(companyId,files)
        return {id: companyId}
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
