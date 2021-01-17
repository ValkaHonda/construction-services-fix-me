import { CoreModule } from '../core/core.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Role } from '../entities/role.entity';

@Module({
  imports: [
    CoreModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([
      User,
      Role,
  ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
