
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./company.entity";
import { Service } from "./service.entity";

@Entity('service_price_company')
export class ServicePriceCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar')
  price: string;

  @ManyToOne(type => Company, company => company.companyPrices)
  companies: Promise<Company>;

  @ManyToOne(type => Service, service => service.companyPrices)
  services: Promise<Service>;
}