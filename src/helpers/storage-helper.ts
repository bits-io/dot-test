import { diskStorage, Options } from "multer";
import * as fs from "fs";
import { BadRequestException } from "@nestjs/common";
import { join } from "path";
import { randomBytes } from "crypto";         // ← import CSPRNG
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

// Konstanta batas ukuran aman maksimum untuk upload (8MB)
const MAX_SAFE_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export class StorageHelper {

  public static disk(maxFileSizeMB = 5): Options {
    const maxSizeBytes = Math.min(maxFileSizeMB * 1024 * 1024, MAX_SAFE_FILE_SIZE);
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = "./storage/uploaded-files";
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Gunakan CSPRNG untuk suffix
          const csprng = randomBytes(8).toString("hex"); // 16 hex chars
          const timestamp = Date.now();
          const [originalName, ...extParts] = file.originalname.split(".");
          const extension = extParts.pop();
          const uniqueFileName = `${originalName}-${timestamp}-${csprng}.${extension}`;
          cb(null, uniqueFileName);
        },
      }),
      limits: {
        fileSize: maxSizeBytes, // dibatasi maksimal 8MB
      },
    };
  }

  public static customDisk(
    customPathCallback: (
      req: any,
      file: any,
      cb: (error: Error | null, customPath: string | null) => void
    ) => void,
    maxFileSizeMB = 5,
    fileFilter?: (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => void
  ): MulterOptions {
    const maxSizeBytes = Math.min(maxFileSizeMB * 1024 * 1024, MAX_SAFE_FILE_SIZE);

    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          customPathCallback(req, file, (err, customPath) => {
            if (err) return cb(err, null);
            const fullPath = join('./storage/uploaded-files', customPath);
            if (!fs.existsSync(fullPath)) {
              fs.mkdirSync(fullPath, { recursive: true });
            }
            cb(null, fullPath);
          });
        },
        filename: (req, file, cb) => {
          const csprng = randomBytes(8).toString('hex');
          const timestamp = Date.now();
          const [originalName, ...extParts] = file.originalname.split('.');
          const extension = extParts.pop();
          const uniqueFileName = `${originalName}-${timestamp}-${csprng}.${extension}`;
          cb(null, uniqueFileName);
        },
      }),
      limits: {
        fileSize: maxSizeBytes,
      },
      fileFilter, // ← Dimasukkan di sini
    };
  }


  public static imageOnlyFilter(req: any, file: any, cb: any) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new BadRequestException("Only image files are allowed!"), false);
    }
    cb(null, true);
  }

  public static pdfOnlyFilter(req: any, file: any, cb: any) {
    if (!file.originalname.match(/\.(pdf)$/i)) {
      return cb(new BadRequestException("Only PDF file is allowed!"), false);
    }
    cb(null, true);
  }

  public static xlsxOnlyFilter(req: any, file: any, cb: any) {
    if (!file.originalname.match(/\.(xlsx)$/i)) {
      return cb(new BadRequestException("Only XLSX file is allowed!"), false);
    }
    cb(null, true);
  }
}
