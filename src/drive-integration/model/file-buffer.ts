export class FileBuffer {
    fileBuffer: Buffer;

    fileName: string;

    // Define well-known properties here

    // Indexer property to allow additional data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;

    constructor(fileBuffer: Buffer, fileName: string) {
        this.fileBuffer = fileBuffer;
        this.fileName = fileName;
    }
}