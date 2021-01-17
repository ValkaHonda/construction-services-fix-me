import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServicePriceCompany } from "./service-price-company.entity";

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column('nvarchar', { unique: true })
  name: string;


  @OneToMany(type => ServicePriceCompany, companyPrice => companyPrice.companies)
  companyPrices: Promise<ServicePriceCompany[]>;
}