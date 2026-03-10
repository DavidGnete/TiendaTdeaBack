import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CretaUserDto, LoginUserDto } from './dto'
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UseRoleGuard } from './guards/use-role/use-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CretaUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  LoginUser(@Body() LoginUserDto: LoginUserDto) {
    return this.authService.Login( LoginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard() )
  testingPrivateRoute(
    /* @Req() request: Express.Request */
    @GetUser() user: User,
    @GetUser('email') UserEmail: string,
  ){

  
    return {
      ok: true,
      message: 'Hola mundo Private',
      user,
      UserEmail
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.user, ValidRoles.admin)
  @UseGuards( AuthGuard(), UseRoleGuard)
  privateRouter2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }


  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRouter3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }
  

}
