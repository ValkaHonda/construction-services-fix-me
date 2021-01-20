import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./company.entity";
import { User } from "./user.entity";

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dateCreated: Date;

  @Column('nvarchar')
  content: string;

  @ManyToOne(type => User, user => user.comments)
  user: Promise<User>;


  @ManyToOne(type => Company, user => user.comments)
  company: Promise<Company>;
}