export interface DriveFile {
  id: string;         // S3 object key
  name: string;       // original filename
  mimeType: string;
  size: string;
  createdTime: string;
  webViewLink: string;
  webContentLink: string;
}
