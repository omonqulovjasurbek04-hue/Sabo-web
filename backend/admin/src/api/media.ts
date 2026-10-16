import { apiClient } from './client';
import { getPaginated, sendData, type ApiEnvelope, type Paginated } from './http';

/** Prisma `Media` model as returned by `/media` endpoints. */
export interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  url: string;
  width: number | null;
  height: number | null;
  altText: string | null;
  folder: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/** `UploadMediaDto` */
export interface UploadMediaInput {
  file: File;
  folder?: string;
  altText?: string;
}

export const MEDIA_FOLDERS = ['general', 'products', 'categories', 'blog', 'certificates'] as const;

export function fetchMedia(params: { page: number; limit: number; folder?: string }): Promise<Paginated<MediaItem>> {
  return getPaginated<MediaItem>('/media', {
    page: params.page,
    limit: params.limit,
    ...(params.folder ? { folder: params.folder } : {}),
  });
}

/** `POST /media/upload` (multipart, field `file`). Large uploads need more than the default 10s timeout. */
export async function uploadMedia({ file, folder, altText }: UploadMediaInput): Promise<MediaItem> {
  const form = new FormData();
  form.append('file', file);
  if (folder) form.append('folder', folder);
  if (altText) form.append('altText', altText);
  const res = await apiClient.post<ApiEnvelope<MediaItem>>('/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120_000,
  });
  return res.data.data;
}

export const deleteMedia = (id: string) => sendData<{ success: boolean; message: string }>('delete', `/media/${id}`);

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
