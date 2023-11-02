import { HemeSampleItem } from "./HemeSampleItem";

export interface RunData {
    id: string | number,
    label: string,
    date: Date,
    dateref: string,
    subgroups: Record<string, string | object>
}

/** Extracts run data from each samples and sorts by reverse date */
export function GetRunData(hemeSamples: HemeSampleItem[]): RunData[] {
    let runData = [];
    let i = 0;
    // for each sample, get the run data
    hemeSamples.forEach((sample) => {
        const runDates = sample.analysisDates;
        const subgroupsItems = sample.subgroups;

        runDates.forEach((datestring, dateCol_index) => {
            const date = new Date(datestring);
            const dateref = 'date' + (dateCol_index + 1);
            const runinfo = {
                'Day': date.toLocaleDateString("en-US"),
                'Time': date.toLocaleTimeString(),
            };

            let data: RunData = {
                id: sample.id,
                label: sample.label,
                date: date,
                dateref: dateref,
                //sample: sample,
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
                    else parseditems[key] = '';
                }
                data.subgroups[key_subgroupid] = { ...obj, ...parseditems };

            }

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
