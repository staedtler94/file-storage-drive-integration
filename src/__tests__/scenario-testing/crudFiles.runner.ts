import 'dotenv/config';
import { DriveGoogle } from '../../drive-integration/service/drive-google';
import { GoogleDriveConfig } from '../../drive-integration/model/drive-config';

import path from 'node:path';
import { FileBuffer } from '../../drive-integration/model/file-buffer';
// import { drive_v3 } from "@googleapis/drive";
// import { GaxiosResponse } from 'googleapis-common';
import {readFileFromLocal} from './readFileFromLocal'
import { getFilesFromFolderQuery } from '../../drive-integration/service/queries/file-queries';

const main = async () => {

    try {
        const driveGoogle = new DriveGoogle();

        driveGoogle.setDriveConfig(
            new GoogleDriveConfig(
                process.env["GOOGLE_DRIVE_CLIENT_EMAIL"],
                process.env.GOOGLE_DRIVE_PRIVATE_KEY,
                ["https://www.googleapis.com/auth/drive"]));
                
        const uploadFilePath = path.join(__dirname, '../../..', 'data', 'Sample Upload.pdf');
        const fileBuffer = await readFileFromLocal(uploadFilePath);

        const parentFolderId = '1nOlGSwYMVsT9lJo3zKturOgJFc6KjnVZ';
        const fileName = 'Sample-upload';

        // const parentFolder = '1sDE4Dnjp_5Qb7hoWb2Uf3hqk0REMnoGe';
        // const fileName = 'PayrollReport_INDONESIA.xlsx';


        // const parentFolderId = '14chUhNWirDDXHZ_sPUj9kDWOKDZkNwhI';
        // const fileName = '2020';


        // for (let index = 0; index < 5; index++) {
        //     const uploadFile = new FileBuffer(fileBuffer, fileName + index + '.pdf');
        //     const fileId = await driveGoogle.uploadFile(
        //         uploadFile, 
        //         parentFolderId
        //     );
    
        //     console.log(fileId)
        // }

        
        // console.log(getFilesFromFolderQuery(fileName,parentFolderId));
        
        // const fl = await (await driveGoogle.getDrive()).files.list({
        //     q: `'1nOlGSwYMVsT9lJo3zKturOgJFc6KjnVZ' in parents`,
        //     corpora: 'drive',
        //     spaces: 'drive',
        //     supportsAllDrives: true,
        //     includeItemsFromAllDrives: true,
        //     driveId: '0ANMHbjeDQgxeUk9PVA',
        //     fields: '*'
        // });

        // console.log(fl);

        const da = await (await driveGoogle.getDrive()).files.get({
            fileId: '1-pnh6YC4p-GOs4xCrAFm-GzDexn88Lsx/edit?gid=1641982363',
            fields: 'trashed',
           
            supportsAllDrives: true,

        }, {errorRedactor: false});
        
        console.log(da.data);
    }
    catch (error) {
        console.log("Error in development");
        console.error(error);
    }
}


try {
    main();
} catch (error) {
    console.error(error);
}