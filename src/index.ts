import 'dotenv/config';
import { DriveGoogle } from './drive-integration/service/drive-google';
import { GoogleDriveConfig } from './drive-integration/model/drive-config';
import { readFile } from 'fs/promises';
import path from 'node:path';
import { FileBuffer } from './drive-integration/model/file-buffer';
import { drive_v3 } from "@googleapis/drive";
import { GaxiosResponse } from 'googleapis-common';

const main = async () => {

    try {

        const driveGoogle = new DriveGoogle();

        driveGoogle.setDriveConfig(
            new GoogleDriveConfig(
                process.env["GOOGLE_DRIVE_CLIENT_EMAIL"],
                process.env.GOOGLE_DRIVE_PRIVATE_KEY,
                ["https://www.googleapis.com/auth/drive"]));

        const drive = await driveGoogle.getDrive();
        const fl = await drive.files.list({
            corpora: 'drive',
            driveId: '0AFh0qtImfLo2Uk9PVA',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });

        const folders = [];
        const fileList = fl.data.files.map((file) => {
            if (file.mimeType === 'application/vnd.google-apps.folder') {
                folders.push(file);
                return false;
            }
            return true;
        });

        console.log(folders);

        const parentFolderId = '1Au5_lxkUkk3EpjmKXSj2HCEYr-QCaDgl';
        const folderPath = 'testing-paths/another-folder';
        const folderIdRet = await driveGoogle.getFolderIdForPath(parentFolderId, folderPath, true, '0AFh0qtImfLo2Uk9PVA');
        console.log(folderIdRet);


        const folderPathForDelete = 'testing-paths/deleting-folder';
        const folderIdRetDel = await driveGoogle.getFolderIdForPath(parentFolderId, folderPathForDelete, true, '0AFh0qtImfLo2Uk9PVA');
        console.log(folderIdRetDel);

        let fileIdDel: GaxiosResponse<drive_v3.Schema$File>;

        const uploadFilePath = path.join(__dirname, '..', 'data', 'Sample Upload.pdf');
        readFile(uploadFilePath).then(async (value) => {
            // console.log(value);
            const uploadFile = new FileBuffer(value, 'Sample-upload-with-correct-nomenclature.pdf');
            const fileId = await driveGoogle.uploadFile(
                uploadFile, 
                folderIdRet
            );
            console.log("File uploaded successfully " + fileId.data.id);

            fileIdDel = await driveGoogle.uploadFile(
                uploadFile, 
                folderIdRetDel
            );

            console.log("File uploaded successfully " + fileIdDel.data.id);
            
            // await driveGoogle.updateFile(uploadFile,'1wgYp31lYA9xKuXNZ1rElEKQMG61rcSZszUm4Ct3Swto');
        });

        const fileId = await driveGoogle.getFileId('Sample-upload.pdf', '1MXsre4UFEwfON86bIv-WHuS7oXEFkehd', '0AFh0qtImfLo2Uk9PVA');
        console.log(fileId);


    } catch (error) {
        console.log("Error in development");
        console.error(error);
    }
}

try {
    main();
} catch (error) {

}