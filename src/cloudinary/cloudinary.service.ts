import { Inject, Injectable} from '@nestjs/common';

import { v2 } from 'cloudinary';



@Injectable()
export class CloudinaryService {
    constructor(@Inject('CONNECTION_CLOUDINARY')private readonly  conector: typeof v2){
        
    }

    async UploadImage (file: Express.Multer.File) {


        return new Promise((resolve, reject) => {
         const saveImage =   this.conector.uploader.upload_stream( {folder:'Products'}, (error, result) =>{ 
                 if (error) {
            return reject(error);
          }return resolve(result);
            })
    
      saveImage.end(file.buffer)

        })
    }
}
