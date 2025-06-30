import { Injectable, BadRequestException } from '@nestjs/common'
import { CustomConfigService } from 'src/global/config/config.service'
import * as path from 'path'
import * as fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import { Express } from 'express'

@Injectable()
export class FileUploadService {
  private readonly uploadPath: string
  private readonly baseUrl: string
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]
  private readonly maxFileSize = 5 * 1024 * 1024

  constructor(private configService: CustomConfigService) {
    this.uploadPath = this.configService.env.UPLOAD_PATH
    this.baseUrl = this.configService.env.BASE_URL
    this.ensureUploadDirectory()
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo')
    }

    this.validateFile(file)

    const fileName = this.generateFileName(file.originalname)
    const filePath = path.join(this.uploadPath, fileName)

    try {
      await fs.writeFile(filePath, file.buffer)
      return `${this.baseUrl}/uploads/images/${fileName}`
    } catch (error) {
      throw new BadRequestException('Error al guardar el archivo')
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const fileName = path.basename(imageUrl)
      const filePath = path.join(this.uploadPath, fileName)

      try {
        await fs.access(filePath)
        await fs.unlink(filePath)
      } catch (error) {
        console.warn(`File not found for deletion: ${filePath}`)
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Tipos permitidos: ${this.allowedMimeTypes.join(', ')}`,
      )
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `El archivo es demasiado grande. Tamaño máximo: ${this.maxFileSize / (1024 * 1024)}MB`,
      )
    }
  }

  private generateFileName(originalName: string): string {
    const ext = path.extname(originalName)
    const timestamp = Date.now()
    const uuid = uuidv4()
    return `${timestamp}-${uuid}${ext}`
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath)
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true })
    }
  }
}
