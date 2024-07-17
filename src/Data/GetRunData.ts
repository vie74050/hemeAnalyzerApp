import { HemeSampleItem } from "./HemeSampleItem";

export interface RunData {
    id: string | number,
    date: Date,
    dateref: string,
    subgroups: Record<string, string | object>
}

/** Extracts run data from each samples and sorts by reverse date 
 * @param hemeSamples - array of HemeSampleItem
 * @returns RunData[] - array of RunData
*/
export function GetRunData(hemeSamples: HemeSampleItem[]): RunData[] {
    let runData = [];
    let i = 0;
    // for each sample, get the run data
    hemeSamples.forEach((sample) => {
        const runDates = sample.analysisDates;
        
        runDates.forEach((datestring, dateCol_index) => {
            const dateref = 'date' + (dateCol_index + 1);
            let data = GetRunDatum(sample, new Date(datestring), dateref);
            
            runData.push(data);
            i++;
        });
    });

    // sort runData by reversed date (recent on top)
    runData = runData.sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
    });
    // add seq to sorted runData runinfo
    runData.forEach((run, index) => {
        run.subgroups['runinfo']['Seq'] = runData.length - index;
    });

    return runData;
}

export function GetRunDatum(hemeSample: HemeSampleItem, date: Date, dateref: string): RunData {

    const subgroupsItems = hemeSample.subgroups;
    
    // format date dd/MMM/yyyy
    const formatter = new Intl.DateTimeFormat('en-us', { day:'numeric', month: 'short' , year: 'numeric'});
    const day = formatter.formatToParts(date).find(part => part.type === 'day').value;
    const month = formatter.formatToParts(date).find(part => part.type === 'month').value;
    const formattedDate = `${day}/${month}/${date.getFullYear()}`;

    const runinfo = {
        'Day': formattedDate,
        'Time': date.toLocaleTimeString(),
    };
    
    let data: RunData = {
        id: hemeSample.id,
        date: date,
        dateref: dateref,
        subgroups: { runinfo: runinfo }
    };

    for (const key_subgroupid in subgroupsItems) {
        const items = subgroupsItems[key_subgroupid] as object;
        const obj = data.subgroups[key_subgroupid] as object || {};

        let parseditems = {};
        for (const itemkey in items) {
            const item = items[itemkey];
            const key = item['item'];
            if (item['description']) parseditems[key] = item['description'];
            else if (item[dateref]) parseditems[key] = item[dateref];
            else if (hemeSample['presenting'] == hemeSample.analysisDate) parseditems[key] = item['presenting'];
            else parseditems[key] = '';
        }
        data.subgroups[key_subgroupid] = { ...obj, ...parseditems };

    }

    return data;
}