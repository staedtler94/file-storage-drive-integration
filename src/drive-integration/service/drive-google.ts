import { drive, drive_v3, auth as googleAuth } from "@googleapis/drive";
import { GoogleDriveConfig } from "../model/drive-config";
import stream from "stream";
import { FileBuffer } from "../model/file-buffer";
import { GaxiosResponse } from 'googleapis-common';

export class DriveGoogle {
    driveClient: drive_v3.Drive;
    gdConfig: GoogleDriveConfig;

    async getDrive(): Promise<drive_v3.Drive> {
        const auth = new googleAuth.GoogleAuth({
            "credentials": {
                "client_email": this.gdConfig.clientEmail,
                "private_key": this.gdConfig.privateKey.replace(/\\n/g, '\n')
            }, scopes: this.gdConfig.scopes
        });

        if(this.driveClient){
            return this.driveClient;
        }

        this.driveClient = drive({
            version: "v3",
            auth,
        });
        return this.driveClient
    }

    setDriveConfig(iConfig: GoogleDriveConfig){
        this.gdConfig = iConfig;
    }

    async getFolderIdForPath(parentFolderId: string, folderPath: string, createFolder: boolean, gdDriveId?: string) {
        const files = [];

        try {
            const drive = await this.getDrive();
            const folderNames = folderPath.split('/');
            let folderId = parentFolderId;

            for (const folderName of folderNames) {
                const folderCondition = " and '" + folderId + "' in parents";

                let res: any;

                if (gdDriveId && gdDriveId?.length > 0) {
                    res = await drive.files.list({
                        q:
                            "name = '" +
                            folderName +
                            "' and mimeType='application/vnd.google-apps.folder'" +
                            folderCondition,
                        fields: 'nextPageToken, files(id, name)',
                        supportsAllDrives: true,
                        driveId: gdDriveId,
                        includeItemsFromAllDrives: true,
                        corpora: 'drive',
                        spaces: 'drive',
                    });
                } else {
                    res = await drive.files.list({
                        q:
                            "name = '" +
                            folderName +
                            "' and mimeType='application/vnd.google-apps.folder'" +
                            folderCondition,
                        fields: 'nextPageToken, files(id, name)',
                        spaces: 'drive',
                    });
                }

                Array.prototype.push.apply(files, res.files);
                if (res?.data?.files?.length > 0) {
                    folderId = res.data.files[0].id;
                } else {
                    if (createFolder) {
                       
                        const fileMetaData = {
                            name: folderName,
                            mimeType: 'application/vnd.google-apps.folder',
                            parents: [folderId],
                        };
                        const fileRes: any = await drive.files
                            .create({
                                fields: 'id',
                                resource: fileMetaData,
                                supportsAllDrives: true,
                            } as any)
                            .catch((err) => {
                                
                                throw new Error('An error occurred while trying to get folder Id for upload path');
                            });
                        folderId = fileRes.data.id;
                    } else {
                        folderId = undefined;
                    }
                }
            }

            return folderId;
        } catch (err) {
            throw err;
        }
    }

    async getFileId(filename: string, parentFolderId: string, driveId: string): Promise<string> {
        const files = [];

        try {
            let fileId = undefined;

            const folderCondition = " and \'" + parentFolderId + "\' in parents";
            const notTrashed = " and trashed = false";
            const q = "name = \'" + filename + "\' and mimeType != \'application/vnd.google-apps.folder\'" + folderCondition + notTrashed;
            // const q = "mimeType != \'application/vnd.google-apps.folder\'";
            const res: any = await (
                await this.getDrive()
            ).files.list({
                q: q,
                fields: 'files(id, name, parents, mimeType, version, webViewLink, trashed)',
                spaces: 'drive',
                driveId: driveId,
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
                corpora: 'drive',
            });

            Array.prototype.push.apply(files, res.files);

            if (res?.data?.files?.length > 0) 
                fileId = res.data.files[0].id;
            else {
                fileId = undefined;
            }

            files.forEach((file) => {
                console.log(file.name, file.id);
            });

            return fileId;
        } catch (err) {

            throw err;
        }
    }

    async uploadFile(reportBuffer: FileBuffer, parentFolder: string) {
        try {
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            const returnedData: GaxiosResponse<drive_v3.Schema$File> = await (
                await this.getDrive()
            ).files.create({
                requestBody: {
                    name: reportBuffer.fileName,
                    parents: [parentFolder],
                    mimeType: 'application/vnd.google-apps.file',
                },
                media: {
                    mimeType: 'application/vnd.pdf', //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    body: this.getStreamForBuffer(reportBuffer.fileBuffer),
                },
                fields: 'id,name',
                supportsAllDrives: true
            });

            return returnedData;
        } catch (error) {
            throw error;
        }
    }

    async updateFile(reportBuffer: FileBuffer, fileId: string) {

        try {
          /* eslint-disable  @typescript-eslint/no-explicit-any */
          const returnedData: any = await (await this.getDrive()).files.update({
            resource: {
              name: reportBuffer.fileName + '1'
            },
            media: {
              mimeType: 'application/vnd.pdf', //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              body: this.getStreamForBuffer(reportBuffer.fileBuffer),
            },
            fileId: fileId,
            newRevision: false,
            supportsAllDrives: true
          } as any);

          return returnedData;
        } catch (error) {
       
          throw error;
        }
      }

    getStreamForBuffer(sourceData: Buffer): stream.Readable {
        const s = new stream.Readable();
        s.push(sourceData);
        s.push(null);

        return s;
    }

    async deleteFile(fileId: string){
        try {
            return await (await this.getDrive()).files.update({
                fileId: fileId,
                supportsAllDrives: true,
                requestBody: {
                    trashed: true
                }
            });
        } catch (error) {
            console.error(error);   
        }
    }
}