import 'dotenv/config';
import { drive, auth as googleAuth } from "@googleapis/drive";
import {DriveV3AuthClient} from './auth.interface';

export class CredentialsAuthorization implements DriveV3AuthClient {
    credentials: {
        client_email: string;
        private_key: string;
    };
    scopes: string[];

    constructor( scopes: string[]) {
        this.credentials = {
            "client_email": process.env["GOOGLE_DRIVE_CLIENT_EMAIL"],
            "private_key": process.env["GOOGLE_DRIVE_PRIVATE_KEY"].replace(/\\n/g, '\n')
        };
        this.scopes = scopes || ["https://www.googleapis.com/auth/drive"];
    }

    async getAuth() {
        const auth = new googleAuth.GoogleAuth({
            "credentials": {
                "client_email": this.credentials.client_email,
                "private_key": this.credentials.private_key.replace(/\\n/g, '\n')
            }, scopes: this.scopes
        });

        return auth;
    }

    async getClient() {
        const auth = await this.getAuth();
        const driveClient = drive({
            version: "v3",
            auth,
        });
        return driveClient;
    }

}