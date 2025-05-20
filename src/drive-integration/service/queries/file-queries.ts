
export function getFilesFromFolderQuery(fileName: string, folderId: string): string {
    return `name = '${fileName}' and mimeType != 'application/vnd.google-apps.folder' and trashed = false and '${folderId}' in parents`;
}