// src/mail/mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const verifyUrl = `${frontendUrl}/auth/verify?token=${token}`;

    try {
      await this.resend.emails.send({
        from: 'Marketplace TDEA <onboarding@resend.dev>',
        to,
        subject: 'Confirma tu cuenta en el Marketplace',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto">
            <h2 style="color:#4F46E5">¡Bienvenido al Marketplace TDEA!</h2>
            <p>Haz clic en el botón para confirmar tu cuenta:</p>
            <a href="${verifyUrl}"
               style="background:#4F46E5;color:white;padding:12px 24px;
                      border-radius:6px;text-decoration:none;display:inline-block;
                      margin:16px 0">
              Confirmar mi cuenta
            </a>
            <p style="color:#888;font-size:12px">
              Este enlace expira en 24 horas. Si no creaste esta cuenta, ignora este correo.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo de verificación');
    }
  }
}