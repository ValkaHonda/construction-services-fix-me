import { User } from '../entities/user.entity';
import { UserLoginDTO } from './../auth/models/user-login.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRegisterDTO } from '../auth/models/user-register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowUserDTO } from './models/show-user.dto';
import { Role } from 'src/entities/role.entity';
import { Service } from 'src/entities/service.entity';
import { ShowServiceDTO } from './models/show-sevice.dto';
import { Company } from 'src/entities/company.entity';
import { ServicePriceCompany } from 'src/entities/service-price-company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(ServicePriceCompany)
    private readonly servicePriceCompanyRepository: Repository<ServicePriceCompany>,
  ) {}

  // One day we should move those "convert" methods in the ConverterService
  public async convertToShowUserDTO(user: User): Promise<ShowUserDTO> {
    
    const convertedUser: ShowUserDTO = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: (await user.role).name,
      avatarURL: user.avatarURL,
      phone: user.phone,
    };
    return convertedUser;
  }

  public async convertToShowServiceDTO(service: Service): Promise<ShowServiceDTO> {
    
    const convertedService: ShowServiceDTO = {
      id: service.id,
      name: service.name,
    };
    return convertedService;
  }
  private async convertToShowUserDTOArray(users: User[]): Promise<ShowUserDTO[]> {
      return Promise.all(users.map(async (entity: User) => this.convertToShowUserDTO(entity)));
  }

  private async convertToShowServiceDTOArray(retrievedServices: Service[]): Promise<ShowServiceDTO[]>{
      return Promise.all(retrievedServices.map(async (entity: Service) => this.convertToShowServiceDTO(entity)));
  }

  async findAllServices() {
    const retrievedServices = await  this.serviceRepository.find()
    return this.convertToShowServiceDTOArray(retrievedServices) 
  }

  async createCompany(companyData: any, creator: User): Promise<{id: string}> {
    const { priceByServiceIds, ...rest} = companyData

    const foundServices: Service[] = await this.serviceRepository.findByIds(Object.keys(priceByServiceIds))
    
    const newCompany: Company = this.companyRepository.create({
      name: rest.name,
      address: rest.address,
      description: rest.description,
      // companyPrices: Promise.resolve(allServicePriceCompanies.filter(({ id }) => servicesPerCompanyCreated.some(service => service.id === id)))
    })
    newCompany.user = Promise.resolve(creator)

    const savedCompany = await this.companyRepository.save(newCompany)


    for(let i = 0; i < foundServices.length; i++) {
      const result = this.servicePriceCompanyRepository.create({
        price: priceByServiceIds[foundServices[i].id],
        // services: Promise.resolve(foundServices[i])
      })
      result.services =  Promise.resolve(foundServices[i])
      result.companies = Promise.resolve(savedCompany)
      await this.servicePriceCompanyRepository.save(result)
    }
    return {id: savedCompany.id}
  }
 
  async register(user: UserRegisterDTO): Promise<ShowUserDTO> {
    const newUser: User = this.usersRepository.create(user);

    const passwordHash = await bcrypt.hash(user.password, 10);
    newUser.password = passwordHash;
    const memberRole: Role = await this.rolesRepository.findOne({
      where: {
        name: 'member',
      },
    });
    newUser.role = Promise.resolve(memberRole);
    newUser.avatarURL = 'https://img2.freepng.ru/20180520/iug/kisspng-computer-icons-user-profile-synonyms-and-antonyms-5b013f455c55c1.0171283215268083893782.jpg';
    const savedUser = await this.usersRepository.save(newUser);

    return this.convertToShowUserDTO(savedUser);

    // return plainToClass(ShowUserDTO, savedUser, { excludeExtraneousValues: true });
  }

  async findUserByEmail(email: string): Promise<ShowUserDTO> | undefined {
    const foundUser = await this.usersRepository.findOne({
      where: {
        email,
        isDeleted: false,
      },
    });

    if (!foundUser) {
      return undefined;
    }
    
    return this.convertToShowUserDTO(foundUser);

    // return plainToClass(ShowUserDTO, foundUser, { excludeExtraneousValues: true });
  }

  async validateUserPassword(user: UserLoginDTO): Promise<boolean> {
    const userEntity = await this.usersRepository.findOne({
      where: {
        email: user.email,
        isDeleted: false,
      },
    });

    return await bcrypt.compare(user.password, userEntity.password);
  }

  async findAllUsers(loggedUser: User): Promise<ShowUserDTO[]>{
    const userEntities:User[] = await this.usersRepository.find({
      where: {
        isDeleted: false,
      },
    });

    return this.convertToShowUserDTOArray(userEntities.filter((user)=>user.id !== loggedUser.id));
  }

  async findSingleUser(userId: string): Promise<ShowUserDTO>{
    const userEntity: User = await this.usersRepository.findOne({
      where: {
        id: userId,
        isDeleted: false,
      },
    });
    if (!userEntity) {
      throw new BadRequestException('User with such ID does not exist.');
    }
    return this.convertToShowUserDTO(userEntity);
  }

}
