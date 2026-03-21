import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MailService } from '../mail/mail.service';

import * as bcrypt from 'bcrypt'

import { LoginUserDto, CretaUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly mailService: MailService,
      private readonly jwtService: JwtService
    ){}


    async create(createUserDto: CretaUserDto) {

    try {
      const {password, ...userData } = createUserDto
      
      const user = this.userRepository.create( {
        ...userData,
        password: bcrypt.hashSync(password, 10),
        isEmailVerified: false,
      });

      await this.userRepository.save ( user)

       const verifyToken = this.jwtService.sign(
      { email: user.email },
      {
        secret: process.env.JWT_VERIFY_SECRET,
        expiresIn: '24h',
      }
    );

    await this.mailService.sendVerificationEmail(user.email, verifyToken);
      
      return {
     message: 'Revisa tu correo para verificar tu cuenta' };


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

  async checkAuthStatus(user: User ){
    return {
      ...user,
    token: this.getJwtToken({id: user.id})};

  }

  private getJwtToken( payload: JwtPayload){

    const token = this.jwtService.sign( payload );
    return token;

  }


  // auth/auth.service.ts — agrega este método al final de la clase
async verifyEmail(token: string) {
  let email: string;

  try {
    // Decodifica y verifica la firma del token
    // Si expiró o fue alterado, lanza una excepción automáticamente
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_VERIFY_SECRET,
    });
    email = payload.email; // extrae el email que guardamos dentro del token
  } catch {
    throw new UnauthorizedException('El enlace es inválido o ya expiró');
  }

  const user = await this.userRepository.findOne({ where: { email } });

  if (!user)
    throw new UnauthorizedException('Usuario no encontrado');

  if (user.isEmailVerified)
    return { message: 'La cuenta ya fue verificada anteriormente' };

  // Actualiza solo el campo isEmailVerified sin tocar nada más
  await this.userRepository.update({ email }, { isEmailVerified: true });

  return { message: '¡Cuenta verificada! Ya puedes iniciar sesión' };
}

  private handleDBErrors( error: any) {

    if ( error.code === "23505")
      throw new BadRequestException( error.detail);

    console.log(error)

    throw new InternalServerErrorException('please check server Login')
  }

  
}
