import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { connectionProvider } from './cloudinary.provider';

@Module({
  providers: [CloudinaryService, connectionProvider ],
  exports: [connectionProvider, CloudinaryService]
})
export class CloudinaryModule  {}
