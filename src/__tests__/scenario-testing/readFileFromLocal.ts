import { readFile } from 'fs/promises';
export async function readFileFromLocal(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        readFile(filePath).then(async (value) => {
            // console.log(value);
            resolve(value);
        }).catch((error) => {
            reject(error);
        }).finally(() => {
            console.log('Read File Completed');
        });
    });
}

