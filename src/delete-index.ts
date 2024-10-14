import 'dotenv/config';
import { DriveGoogle } from './drive-integration/service/drive-google';
import { GoogleDriveConfig } from './drive-integration/model/drive-config';

const main = async () => {
    try{
        const driveGoogle = new DriveGoogle();

        driveGoogle.setDriveConfig(
            new GoogleDriveConfig(
                process.env["GOOGLE_DRIVE_CLIENT_EMAIL"],
                process.env.GOOGLE_DRIVE_PRIVATE_KEY,
                ["https://www.googleapis.com/auth/drive"]));
        
        const ret = await driveGoogle.deleteFile("1rlxW25VlJsi3ygqjeoh8NXGT3WmyL1-rMMvJfZ6H6po");
        console.log(JSON.stringify(ret));

    }catch(error){
        console.log("Error in development");
        console.error(error);
    }
}


try {
    main();
} catch (error) {

}