import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./company.entity";

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar')
  url: string;

  @ManyToOne(type => Company, company => company.images)
  company: Promise<Company>;
}