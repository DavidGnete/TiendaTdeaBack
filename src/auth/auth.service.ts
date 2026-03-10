import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt'

import { LoginUserDto, CretaUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,

      private readonly jwtService: JwtService
    ){}

    async create(createUserDto: CretaUserDto) {

    try {
      const {password, ...userData } = createUserDto
      
      const user = this.userRepository.create( {
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save ( user)
      
      return {
      ...user,
    token: this.getJwtToken({ id: user.id})};


    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async Login(LoginUserDto: LoginUserDto){

    const {password, email} =LoginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true}
    })
    if (!user)
      throw new UnauthorizedException('Credentiales are not valid (email)');

    if ( !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentiales are not valid (password)');
    
    return {
      ...user,
    token: this.getJwtToken({id: user.id})};
 
  }

  private getJwtToken( payload: JwtPayload){

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBErrors( error: any) {

    if ( error.code === "23505")
      throw new BadRequestException( error.detail);

    console.log(error)

    throw new InternalServerErrorException('please check server Login')
  }

  
}
