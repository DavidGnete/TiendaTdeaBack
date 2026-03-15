/* import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger('MailService');

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(email: string, fullName: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    try {
      await this.resend.emails.send({
        from: 'Tienda TDEA <noreply@correo.tdea.edu.co>',
        to: email,
        subject: 'Activa tu cuenta en Tienda TDEA',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #111;">
              Hola, ${fullName} 👋
            </h1>
            <p style="color: #555; margin-top: 8px;">
              Gracias por registrarte en <strong>Tienda TDEA</strong>. 
              Para activar tu cuenta haz clic en el botón:
            </p>
            <a
              href="${verificationUrl}"
              style="
                display: inline-block;
                margin-top: 24px;
                padding: 12px 28px;
                background-color: #2d9f6e;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 15px;
              "
            >
              Activar mi cuenta
            </a>
            <p style="color: #999; font-size: 13px; margin-top: 24px;">
              Si no creaste esta cuenta, ignora este mensaje.
              El enlace expira en 24 horas.
            </p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error('Error enviando email de verificación', error);
      throw new InternalServerErrorException('No se pudo enviar el email de verificación.');
    }
  }
} */