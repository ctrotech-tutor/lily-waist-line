const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/x-png',
  'image/webp',
  'image/gif',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export function isAllowedImageType(mimeType: string, fileName?: string): boolean {
  if (ALLOWED_MIME_TYPES.includes(mimeType)) return true;

  if (fileName) {
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) return true;
  }

  return false;
}

export function getAllowedImageAcceptString(): string {
  return ALLOWED_MIME_TYPES.join(',');
}
