import { User } from './entity/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { ServerException } from 'src/types/serverException';
import { Repository, UpdateResult } from 'typeorm';
import { HttpStatusCodes } from 'src/constants/statusCodes';
import { isEmail } from 'src/constants/regExp';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const userHash = await this.hashService.getUserData<CreateUserDto>(
        createUserDto,
      );
      return await this.usersRepository.save(userHash);
    } catch (err) {
      if ('code' in err && err.code == 23505) {
        throw new ServerException(HttpStatusCodes.CONFLICT);
      }
      throw new ServerException(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByName(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    let user: UpdateResult;
    try {
      const newUserData = updateUserDto.hasOwnProperty('password')
        ? await this.hashService.getUserData<UpdateUserDto>(updateUserDto)
        : updateUserDto;

      user = await this.usersRepository.update(id, newUserData);
    } catch (e) {
      if ('code' in e && e.code == 23505) {
        throw new ServerException(HttpStatusCodes.CONFLICT);
      }
      throw new ServerException(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (user?.affected === 0) {
      throw new ServerException(HttpStatusCodes.BAD_REQUEST);
    }

    return this.findById(id);
  }

  async findByQuery(query: string) {
    const isValidEmail = isEmail.test(query);
    if (isValidEmail) {
      return await this.usersRepository.findBy({ email: query });
    }
    return await this.usersRepository.findBy({ username: query });
  }

  async findWishes(id: number, relations: string[]) {
    const { wishes } = await this.usersRepository.findOne({
      where: { id },
      relations,
    });

    if (!wishes) {
      throw new ServerException(HttpStatusCodes.NOT_FOUND);
    }

    return wishes;
  }
}
