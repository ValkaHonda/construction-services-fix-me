import { OneToMany, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { User } from "./user.entity";


@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(type => User, user => user.role)
  users: Promise<User[]>;
 
}