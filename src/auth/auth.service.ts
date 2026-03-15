import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from './entities/user.entity';
import { LoginUserDto, CretaUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // ── Registro ────────────────────────────────────────────────────────
  async create(createUserDto: CretaUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      // Genera token único de verificación
      const emailVerificationToken = uuidv4();

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        isActive: true,                  // inactivo hasta verificar email
        emailVerificationToken: null,
      });

      await this.userRepository.save(user);

      // Envía email de verificación
      await this.mailService.sendVerificationEmail(
        user.email,
        user.fullName,
        emailVerificationToken,
      );

      return {
        message: 'Cuenta creada. Revisa tu correo institucional para activarla.',
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // ── Verificación de email ───────────────────────────────────────────
  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        emailVerificationToken: true,
        roles: true,
        WhattsapNumber: true,
      },
    });

    if (!user)
      throw new NotFoundException('Token de verificación inválido o expirado.');

    if (user.isActive)
      throw new BadRequestException('Esta cuenta ya fue verificada.');

    // Activa la cuenta y elimina el token
    user.isActive = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);

    // Retorna token JWT para que el usuario quede logueado automáticamente
    return {
      message: '¡Cuenta activada! Ya puedes usar Tienda TDEA.',
      token: this.getJwtToken({ id: user.id }),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        WhattsapNumber: user.WhattsapNumber,
        roles: user.roles,
        isActive: user.isActive,
      },
    };
  }

  // ── Login ───────────────────────────────────────────────────────────
  async Login(LoginUserDto: LoginUserDto) {
    const { password, email } = LoginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        isActive: true,
        fullName: true,
        WhattsapNumber: true,
        roles: true,
      },
    });

    if (!user)
      throw new UnauthorizedException('Credenciales no válidas.');

    if (!user.isActive)
      throw new UnauthorizedException(
        'Cuenta no verificada. Revisa tu correo institucional.',
      );

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales no válidas.');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  // ── Check status ────────────────────────────────────────────────────
  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  // ── Helpers ─────────────────────────────────────────────────────────
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Error interno del servidor.');
  }
}