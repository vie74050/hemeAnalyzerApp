type QCsubgroups = 'sampleinfo' | 'reagentinfo' | 'runinfo' | 'haparameter';
type PAsubgroups = 'patientinfo' | 'reagentinfo' | 'runinfo' | 'haparameter';

/* Class that accepts a Record<string, string> and returns a HemeSample object.
 The parent class for QC and PA samples.
*/
export class HemeSampleItem {
    private _rawData: Record<string, string | object>;

    constructor(sample: Record<string, string | object>) {
        this._rawData = sample;
    }

    public get data(): Record<string, string | object> {
        return this._rawData;
    }

    public get id(): string {
        return this._rawData['id'] as string;
    }

    public GetSubgroup(sgid: QCsubgroups | PAsubgroups): { [key: string]: Record<string, string>; } {

        return this._rawData[sgid] as { [key: string]: Record<string, string>; };
    }

}

export class QCSampleItem extends HemeSampleItem {
    constructor(itemInfo: Record<string, string | object>) {
        super(itemInfo);
    }
    public setQCFileNo(fileNo: string) {
        this.data.qcfileno = fileNo;
    }
    public get lotNo(): string {
        return this.data.label as string;
    }
    public get material(): string {
        let mat = "";
        //console.log(this.GetSubgroup('sampleinfo')['material']['description']);
        mat = this.GetSubgroup('sampleinfo')['material'] ? this.GetSubgroup('sampleinfo')['material']['description'] as string : "";
        return mat;
    }
    public get expiry(): string {
        let exp = "";
        exp = this.GetSubgroup('sampleinfo')['expirydate'] ? this.GetSubgroup('sampleinfo')['expirydate']['description'] as string : "";
        return exp;
    }
    public get analysisDate(): string {
        // returns the last analysis date in the analysisdates string
        let analysisdates = (this.data.analysisdates as string).split(';');
        return analysisdates[analysisdates.length - 1];
    }
    public get analysisDates(): string[] {
        // returns all analysis dates in the analysisdates string
        let analysisdates = (this.data.analysisdates as string).split(';');
        return analysisdates;
    }
}

export class PASampleItem extends HemeSampleItem {
    constructor(itemInfo: Record<string, string | object>) {
        super(itemInfo);
    }
}
