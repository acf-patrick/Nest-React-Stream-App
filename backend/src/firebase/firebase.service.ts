import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import {
  FirebaseStorage,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { writeFile } from 'fs';
import { promisify } from 'util';

@Injectable()
export class FirebaseService {
  private storage: FirebaseStorage;

  constructor(configService: ConfigService) {
    const app = initializeApp({
      apiKey: configService.get<string>('API_KEY'),
      authDomain: configService.get<string>('AUTH_DOMAIN'),
      projectId: configService.get<string>('PROJECT_ID'),
      storageBucket: configService.get<string>('STORAGE_BUCKET'),
      messagingSenderId: configService.get<string>('MESSAGING_SENDER_ID'),
      appId: configService.get<string>('APP_ID'),
      measurementId: configService.get<string>('MEASUREMENT_ID'),
    });
    this.storage = getStorage(app);
  }

  async upload(file: Buffer, dest: string) {
    const destRef = ref(this.storage, dest);
    try {
      await uploadBytes(destRef, file);
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException('Failed to upload video');
    }
  }

  async delete(file: string) {
    const fileRef = ref(this.storage, file);
    await deleteObject(fileRef);
  }

  async download(file: string, dest: string) {
    try {
      const fileRef = ref(this.storage, file);
      const url = await getDownloadURL(fileRef);
      const res = await fetch(url);
      const buf = await res.arrayBuffer();

      const writeFileAsync = promisify(writeFile);
      await writeFileAsync(dest, Buffer.from(buf));
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException(`Unable to download ${file}`);
    }
  }

  async getUrl(file: string) {
    const fileRef = ref(this.storage, file);
    try {
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (e) {
      console.error(e);
      throw new NotFoundException(`${file} not found`);
    }
  }
}
