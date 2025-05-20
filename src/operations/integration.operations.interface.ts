
export interface Operations {
    createFile: (path: string, content: string) => Promise<string>;
}