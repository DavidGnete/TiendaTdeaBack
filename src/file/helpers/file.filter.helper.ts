export const FileFilter = (req: Express.Request, file:Express.Multer.File, callback: Function) => {

/*     console.log(file)
 */ 
        if (!file ) return callback( new Error('File esta vacio'), false);

        const fileExtension = file.mimetype.split('/')[1];

        const valiExtensions= ['jpg','jpeg','png','webp', ]

        if ( valiExtensions.includes ( fileExtension)){
            return callback( null, true)
        }

    callback(null, false);
}