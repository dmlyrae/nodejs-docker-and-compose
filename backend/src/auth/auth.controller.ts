import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { LocalAuthGuard } from '../auth/guards/local.guard';
import { User } from 'src/users/entity/user.entity';
import { InvalidDataExceptionFilter } from 'src/filters/invalid-data-exception.filter';

@UseFilters(InvalidDataExceptionFilter)
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signin(@Req() req: Request & { user: User }) {
    return this.authService.auth(req.user);
  }
}
