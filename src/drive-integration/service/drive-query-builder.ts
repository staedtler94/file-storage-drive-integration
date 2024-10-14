
export enum DriveQueryTypeOPs {
    Equal = " = ",
    NotEqual = " != ",

    Default = ' = '
}

export class DriveQuery {

    basicQuery: string;
    operator: DriveQueryTypeOPs;
    constructor(input?: string) {
        this.basicQuery = "";

        if (input) {
            this.basicQuery = input;
        }
    }

    and(): DriveQuery {
        this.basicQuery + " add ";
        this.operator = DriveQueryTypeOPs.Default;
        return this;
    }

    addName(name: string): DriveQuery {
        this.basicQuery + + " name = " + name;
        this.setOperatorToDefault();
        return this;
    }

    addMimeType(mimeType: string): DriveQuery {
        this.basicQuery + " mimeType" + this.getOperator() + mimeType;
        return this;
    }

    createdOn(date: string): DriveQuery {
        this.basicQuery + " createdTime = " + date;
        return this;
    }

    is(): DriveQuery {
        return this;
    }

    equalTo(): DriveQuery {
        this.operator = DriveQueryTypeOPs.Equal;
        return this;
    }

    private getOperator(): string {
        return DriveQueryTypeOPs[this.operator];
    }

    private setOperatorToDefault(): void {
        this.operator = DriveQueryTypeOPs.Default;
    }
}