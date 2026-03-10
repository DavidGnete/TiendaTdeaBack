import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilter } from './helpers/file.filter.helper';
import { ApiProperty } from '@nestjs/swagger';


@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiProperty()
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: FileFilter,
    /* limits: {} */
    
  }))
  uploadFileImage(
    @UploadedFile() file: Express.Multer.File){

      if ( !file ) {
        throw new BadRequestException('Make sure that the file is a IMAGE')
      }

    return this.fileService.UploadIMage(file)

  }
}
