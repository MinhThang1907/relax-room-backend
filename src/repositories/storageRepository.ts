import { storageBucket } from "../lib/storageBucket"

export class StorageRepository {
  async getPublicUrl(bucket: string, path: string): Promise<string> {
    if (bucket !== "moods-audio") {
      throw new Error("Invalid bucket name")
    }
    return storageBucket.getPublicUrl(path)
  }
}

export const storageRepository = new StorageRepository()
