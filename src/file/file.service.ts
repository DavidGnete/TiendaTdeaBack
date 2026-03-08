import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';



@Injectable()
export class FileService {

    constructor (private readonly cloudinaryService: CloudinaryService){
    }

    async UploadIMage (file: Express.Multer.File) {
        return this.cloudinaryService.UploadImage(file)
    }

    
}
