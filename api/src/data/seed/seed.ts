import { User } from "./../../entities/user.entity";
import { createConnection, Equal, Not } from "typeorm";
import * as bcrypt from "bcrypt";
import { Role } from "../../entities/role.entity";
import { Service } from "../../entities/service.entity";

const main = async () => {
  const connection = await createConnection();

  const userRepository = connection.manager.getRepository(User);
  const roleRepository = connection.manager.getRepository(Role);
  const serviceRepository = connection.manager.getRepository(Service);

  const service1: Service = await serviceRepository.findOne({
    where: {
      name: 'Боядисване'
    }
  })

  if(!service1){
    const newService: Service = new Service();
    newService.name = 'Боядисване'
    await serviceRepository.save(newService);
    console.log("Created service1.");
  } else {
    console.log("service1 already in the DataBase");
  }


  const service2: Service = await serviceRepository.findOne({
    where: {
      name: 'Измазване'
    }
  })

  if(!service2){
    const newService: Service = new Service();
    newService.name = 'Измазване'
    await serviceRepository.save(newService);
    console.log("Created service2.");
  } else {
    console.log("service2 already in the DataBase");
  }



  const service3: Service = await serviceRepository.findOne({
    where: {
      name: 'Сглобяване'
    }
  })

  if(!service3){
    const newService: Service = new Service();
    newService.name = 'Сглобяване'
    await serviceRepository.save(newService);
    console.log("Created service3.");
  } else {
    console.log("service3 already in the DataBase");
  }

  const member: Role = await roleRepository.findOne({
    where: {
      name: "member",
    },
  });

  if (!member) {
    const newMemberRole: Role = new Role();
    newMemberRole.name = "member";
    await roleRepository.save(newMemberRole);
    console.log("Created member role.");
  } else {
    console.log("Member role already in the DataBase");
  }

  const admin: Role = await roleRepository.findOne({
    where: {
      name: "admin",
    },
  });

  if (!admin) {
    const newAdminRole: Role = new Role();
    newAdminRole.name = "admin";
    await roleRepository.save(newAdminRole);
    console.log("Created admin role.");
  } else {
    console.log("Admin role already in the DataBase");
  }
  // The seed script starts here:
  const valka: User = await userRepository.findOne({
    where: {
      email: "valentin805@gmail.com",
    },
  });

  if (!valka) {
    const user1: User = new User();
    user1.username = "Valka";
    user1.email = "valentin805@gmail.com";
    user1.password = await bcrypt.hash("aaAA$$123456789", 10);
    user1.firstName = "Valentin";
    user1.lastName = "Aleksandrov";
    user1.phone = "09764";
    user1.avatarURL =
      "https://avatars2.githubusercontent.com/u/26555796?s=460&v=4";
    const user1Role = await roleRepository.findOne({
      where: {
        name: "member",
      },
    });
    user1.role = Promise.resolve(user1Role);

    await userRepository.save(user1);
    console.log("Valka created!");
  } else {
    console.log("Valka is already in the Database!");
  }

  const valka2: User = await userRepository.findOne({
    where: {
      email: "valentin2805@gmail.com",
    },
  });

  if (!valka2) {
    const user1: User = new User();
    user1.username = "Valka2";
    user1.email = "valentin2805@gmail.com";
    user1.password = await bcrypt.hash("aaAA$$123456789", 10);
    user1.firstName = "Valentin2";
    user1.lastName = "Aleksandrov2";
    user1.phone = "09764";
    user1.avatarURL =
      "https://img2.freepng.ru/20180520/iug/kisspng-computer-icons-user-profile-synonyms-and-antonyms-5b013f455c55c1.0171283215268083893782.jpg";
    const user1Role = await roleRepository.findOne({
      where: {
        name: "member",
      },
    });
    user1.role = Promise.resolve(user1Role);

    await userRepository.save(user1);
    console.log("Valka2 created!");
  } else {
    console.log("Valka2 is already in the Database!");
  }

  connection.close();
};

main().catch(console.error);
