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
import { Image } from 'src/entities/image.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { date } from 'joi';

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
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
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

  async checkForLike(companyId: string, user: User): Promise<any> {
    const foundCompany = await this.companyRepository.findOne({ where: { id: companyId}})
    const totalLikes = (await foundCompany.likes).length
    if(!foundCompany) {
      return ({ like: false, totalLikes})
    }
    const likes = await foundCompany.likes
    
    return ({ like: Boolean(likes.find((currentUser: User) => currentUser.id === user.id)), totalLikes})
  }

  async createComment(commentData: any, companyId: string, user: User): Promise<any> {
    const foundUser = await this.usersRepository.findOne({ where: { id: user.id}})
    const foundCompany = await this.companyRepository.findOne({ where: { id: companyId}}) 
    const newComment: CommentEntity = this.commentRepository.create()
    newComment.content = commentData.content
    newComment.dateCreated = new Date()
    newComment.company = Promise.resolve(foundCompany)
    newComment.user = Promise.resolve(foundUser)
    const savedComment = await this.commentRepository.save(newComment)
    return {
        dateCreated: savedComment.dateCreated,
        user: (await savedComment.user).username,
        content: savedComment.content,
        userAvatarURL: (await savedComment.user).avatarURL
    }
  }

  async getCommentsByCompanyId(companyId: string): Promise<any> {
    const foundCompany = await this.companyRepository.findOne({ where: { id: companyId}}) 
    const foundComments = await foundCompany.comments
    const showCommentsDTO = []

    for (const currentComment of foundComments) {
      showCommentsDTO.push({
        dateCreated: currentComment.dateCreated,
        user: (await currentComment.user).username,
        content: currentComment.content,
        userAvatarURL: (await currentComment.user).avatarURL
      })
    }
    return showCommentsDTO
  }

async toggleLike(companyId: string, user: User): Promise<any> {
    const foundCompany = await this.companyRepository.findOne({ where: { id: companyId}})
    const foundUser = await this.usersRepository.findOne({ where: { id: user.id}})
    const foundLikeCompanies = await foundUser.likedCompanies || []
    const alreadyLiked = foundLikeCompanies.some(company => company.id === companyId)
    
    if(!alreadyLiked) {
      const foundLikers = await foundCompany.likes
      foundLikers.push(foundUser)
      foundCompany.likes = Promise.resolve(foundLikers)
      await this.companyRepository.save(foundCompany)
      
      return ({ like: true})
    }
    const likes = await foundCompany.likes 
    const fewerLikes = []

    for (const currentLike of likes) {
      if(currentLike.id !== user.id){
        fewerLikes.push(currentLike)
      }
    }

    foundCompany.likes = Promise.resolve(fewerLikes)
    await this.companyRepository.save(foundCompany)
    return ({ like: false})
    
  }

  async getAllCompanies(): Promise<any> {
    const foundCompanies: Company[] = await this.companyRepository.find()
    const showCompaniesDTO: any = []
    for (const currentCompany of foundCompanies) {
      const foundImages = await currentCompany.images

      const companyPricesForServices = await this.servicePriceCompanyRepository.find()
      
      const companyServicesWithPriceDTO = []
      for (const currentPriceForService of companyPricesForServices) {
        const parentCompany = await currentPriceForService.companies

        if(parentCompany.id === currentCompany.id){
          const {price} = currentPriceForService
          companyServicesWithPriceDTO.push({
            price: price,
            name: (await currentPriceForService.services).name,
            id: (await currentPriceForService.services).id
          })
        }

      }
      
      showCompaniesDTO.push({
        id: currentCompany.id,
        name: currentCompany.name,
        description: currentCompany.description,
        creator: (await currentCompany.user).username,
        address: currentCompany.address,
        images: foundImages,
        phone: currentCompany.phone,
        email: currentCompany.email,
        services: companyServicesWithPriceDTO
      })
    }
    return showCompaniesDTO
  }

  async createCompany(companyData: any, creator: User): Promise<{id: string}> {
    const { priceByServiceIds, ...rest} = companyData

    const foundServices: Service[] = await this.serviceRepository.findByIds(Object.keys(priceByServiceIds))
    
    const newCompany: Company = this.companyRepository.create({
      name: rest.name,
      address: rest.address,
      description: rest.description,
      phone: rest.phone,
      email: rest.email,
    })
    newCompany.user = Promise.resolve(creator)

    const savedCompany = await this.companyRepository.save(newCompany)


    for(let i = 0; i < foundServices.length; i++) {
      const result = this.servicePriceCompanyRepository.create({
        price: priceByServiceIds[foundServices[i].id],
      })
      result.services =  Promise.resolve(foundServices[i])
      result.companies = Promise.resolve(savedCompany)
      await this.servicePriceCompanyRepository.save(result)
    }
    return {id: savedCompany.id}
  }

  async attachImagesToCompany(companyId: string, images: any): Promise<void> {
    const foundCompany = await this.companyRepository.findOne({ where: {
      id: companyId,
    }})

    for (const currentImage of images) {
      const newImage: Image = this.imageRepository.create({
        url: `http://localhost:3008/public/${currentImage.filename}`
      })
      newImage.company = Promise.resolve(foundCompany)
      await this.imageRepository.save(newImage)
    }
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
