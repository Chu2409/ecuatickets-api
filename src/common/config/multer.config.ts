import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { BadRequestException } from '@nestjs/common'

export const multerConfig: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ]

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(
        new BadRequestException(
          `Tipo de archivo no permitido. Tipos permitidos: ${allowedMimeTypes.join(', ')}`,
        ),
        false,
      )
    }
  },
}
