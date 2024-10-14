
export class GoogleDriveConfig{
    clientEmail: string;
    privateKey: string;
    scopes: string[];

    constructor(clientEmail: string, privateKey: string, scopes: string[]){
        this.clientEmail = clientEmail;
        this.privateKey = privateKey;
        this.scopes = scopes;
    }
}