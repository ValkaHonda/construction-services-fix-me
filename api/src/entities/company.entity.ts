import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { ServicePriceCompany } from "./service-price-company.entity";
import { User } from "./user.entity";

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar', { unique: true })
  name: string;

  @Column('nvarchar')
  address: string;

  @Column('nvarchar')
  description: string;

  @OneToMany(type => ServicePriceCompany, servicePrice => servicePrice.services)
  companyPrices: Promise<ServicePriceCompany[]>;

  @ManyToOne(type => User, user => user.companies)
  user: Promise<User>;

  @OneToMany(type => CommentEntity, comment => comment.company)
  comments: Promise<Comment[]>;

  @ManyToMany(type => User, user => user.likedCompanies)
  @JoinTable()
  likes: Promise<Company[]>
}