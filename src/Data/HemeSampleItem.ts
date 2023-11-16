type QCsubgroups = 'sampleinfo' | 'reagentinfo' | 'runinfo' | 'haparameter' | 'other';
type PAsubgroups = 'patientinfo' | 'reagentinfo' | 'runinfo' | 'haparameter' | 'other';

/* Class that accepts a Record<string, string> and returns a HemeSample object.
 The parent class for QC and PA samples.
*/
class HemeSampleItem {
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

    public get label(): string {
        return this._rawData['label'] as string;
    }

    public get group(): string {
        return this._rawData['groups'] as string;
    }
    /** Returns all the subgroups in raw data */
    public get subgroups(): Record<string, string | object> {
        return this.data['subgroups'] as Record<string, string | object>;
    }
    /** Returns all the items for the subgroup, sgid
     * @param sgid 
     */
    public GetItemsOfSubgroup(sgid: QCsubgroups | PAsubgroups): { [key: string]: Record<string, string>; } {
        return this.data['subgroups'][sgid] as { [key: string]: Record<string, string>; };
    }
    /** Returns the last analysis date in the analysisdates string */
    public get analysisDate(): string {
        let analysisdates = this.analysisDates;
        return analysisdates[analysisdates.length - 1] || "";
    }
    /** Returns all analysis dates in the analysisdates string */
    public get analysisDates(): string[] {
        let analysisdates = (this.data.analysisdates as string || "").split(/ *; */);

        if (analysisdates) {
            // remove empty strings
            analysisdates = analysisdates.filter((date) => date != "");
        }
        // sort analysisdates
        analysisdates.sort((a, b) => {
            let aDate = new Date(a);
            let bDate = new Date(b);
            return aDate.getTime() - bDate.getTime();
        });
        return analysisdates;
    }
   
    public set analysisDates(dates: string[]) {
        this.data.analysisdates = dates.join('; ');
    }
    /** Returns presenting date */
    public get presenting(): string | undefined {
        return this.data.presenting as string | undefined;
    }
    
    /** Add presenting to analysisDates */
    public addPresentingAsNewRun() {
        
        if (this.data.presenting) {
            let presenting = this.data.presenting as string;
            let analysisdates = this.analysisDates;
            analysisdates.push(presenting);
            this.analysisDates = analysisdates;
            let n = analysisdates.length;

            // add new dateref 'Date'+n to all subgroup items
            for (let key in this.subgroups) {
                let items = this.subgroups[key] as { [key: string]: object };
                for (let itemkey in items) {
                    
                    let item = items[itemkey];

                    if (item['description'] == null && item['date' + n] == null)
                        item['date' + n] = item['presenting'];
                    
                    //console.log(n,item);
                }
            }
            
        }
        
    }

    public hasPresenting(): boolean {
        let haparameters = this.GetItemsOfSubgroup('haparameter');
        let haspresenting = false;

        for (let key in haparameters) {
            if (haparameters[key]['presenting'] != null) {
                haspresenting = true;
                break;
            }
        }

        return haspresenting;
    }

}

class QCSampleItem extends HemeSampleItem {
    constructor(itemInfo: Record<string, string | object>) {
        super(itemInfo);
    }
    
    public get lotNo(): string {
        return this.data.label as string;
    }
    public get material(): string {
        let mat = "";
        //console.log(this.GetSubgroup('sampleinfo')['material']['description']);
        mat = this.GetItemsOfSubgroup('sampleinfo')['material'] ? this.GetItemsOfSubgroup('sampleinfo')['material']['description'] as string : "";
        return mat;
    }
    public get expiry(): string {
        let exp = "";
        exp = this.GetItemsOfSubgroup('sampleinfo')['expirydate'] ? this.GetItemsOfSubgroup('sampleinfo')['expirydate']['description'] as string : "";
        return exp;
    }
    
}

export { HemeSampleItem, QCSampleItem }