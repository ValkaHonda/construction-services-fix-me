import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { Company } from './company.entity';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar', { unique: true })
  username: string;

  @Column('nvarchar', { unique: true })
  email: string;

  @Column('nvarchar')
  avatarURL: string;

  @Column('nvarchar')
  password: string;

  @Column('nvarchar')
  firstName: string;

  @Column('nvarchar')
  lastName: string;

  @Column('nvarchar')
  phone: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(type => Role, role => role.name)
  role: Promise<Role>;

  @OneToMany(type => Company, company => company.user)
  companies: Promise<Company[]>;

  @OneToMany(type => CommentEntity, comment => comment.user)
  comments: Promise<Comment[]>;

  @ManyToMany(type => Company, company => company.likes)
  likedCompanies: Promise<Company[]>
}
