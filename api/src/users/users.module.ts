import { CoreModule } from '../core/core.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Role } from '../entities/role.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { Company } from 'src/entities/company.entity';
import { Image } from 'src/entities/image.entity';
import { ServicePriceCompany } from 'src/entities/service-price-company.entity';
import { Service } from 'src/entities/service.entity';

@Module({
  imports: [
    CoreModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([
      User,
      Role,
      CommentEntity,
      Company,
      Image,
      ServicePriceCompany,
      Service,
  ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
