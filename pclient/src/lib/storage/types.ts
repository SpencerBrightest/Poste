export interface UploadResult {
  url: string;
  storageKey: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

export interface StorageProvider {
  /**
   * Upload a file to storage
   */
  upload(params: {
    file: File;
    folder?: string;
    organizationId: string;
  }): Promise<UploadResult>;

  /**
   * Delete a file from storage
   */
  delete(storageKey: string): Promise<void>;

  /**
   * Get a public URL for a file
   */
  getUrl(storageKey: string): string;

  /**
   * Transform an image (resize, crop, etc.)
   */
  transformImage(params: {
    storageKey: string;
    transformations?: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: number;
    };
  }): string;
}
