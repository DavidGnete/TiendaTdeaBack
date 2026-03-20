// src/mail/mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MailService {
  constructor(private readonly config: ConfigService) {}

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const verifyUrl = `${frontendUrl}/auth/verify?token=${token}`;

    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name: 'Marketplace TDEA',
            email: this.config.get<string>('MAIL_FROM'),
          },
          to: [{ email: to }],
          subject: 'Confirma tu cuenta en el Marketplace TDEA',
          htmlContent: `
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
                Este enlace expira en 24 horas.
              </p>
            </div>
          `,
        },
        {
          headers: {
            'api-key': this.config.get<string>('BREVO_API_KEY'),
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Brevo respondió:', response.data)
    } catch (error) {
       console.error(' Error Brevo:', error.response?.data);
      throw new InternalServerErrorException('No se pudo enviar el correo de verificación');
    }
  }
}