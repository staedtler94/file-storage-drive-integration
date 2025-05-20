
export interface DriveV3AuthClient {
    getAuth(): Promise<any>;
    getClient(): Promise<any>;
}