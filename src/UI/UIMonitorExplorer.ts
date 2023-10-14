import { HemeSampleItem } from "../Data/HemeSampleItem";
import { selectElemFromGroup, UICreateElemFromString } from "../helpers/domElemHelper";

interface RunData {
    id: string | number,
    label: string,
    date: Date,
    subgroups: Record<string, string | object>
}

const explorerhtml = require('./UIMonitorExplorer.html').default;
enum explorerNav {
    runinfo = 'runinfo',
    patientinfo = 'patientinfo',
    reagentinfo = 'reagentinfo'
}

function UICreateExplorerPage(
    data: Record<string, string>[], 
    hemeSamples: HemeSampleItem[], 
    $explorerpage: HTMLDivElement
){
    // get run data    
    const rundata = getRunData(hemeSamples); console.log(rundata);
    const $subnavdiv = document.createElement('div');
    $subnavdiv.classList.add('subnav');
    $explorerpage.appendChild($subnavdiv);

    let btngroup = [], tablegrp = [];
    
    // for each explorerNav, create table from explorerhtml as template
    for (const key in explorerNav) {
        const nav = explorerNav[key];

        // create a button for each nav
        const $btn = document.createElement('button');
        $btn.id = nav;
        $btn.classList.add('btn', 'btn-sm');

        $btn.innerText = nav; 
        btngroup.push($btn);
        $subnavdiv.appendChild($btn);
        $btn.addEventListener('click', () => {
            selectElemFromGroup($btn, btngroup);
            selectElemFromGroup($table, tablegrp);
        });
        
        const $table = UICreateElemFromString(explorerhtml, 'table') as HTMLTableElement;
        $table.id = nav;

        tablegrp.push($table);
        $explorerpage.appendChild($table);
        createTableContent(rundata, $table);
    }    

    // set default selected button
    selectElemFromGroup(btngroup[0], btngroup);
    selectElemFromGroup(tablegrp[0], tablegrp);

}

/** Extracts run data from each samples and sorts by reverse date */
function getRunData(hemeSamples: HemeSampleItem[]): RunData[] {
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
            }
            
            let data: RunData = {
                id: sample.id,
                label: sample.label,
                date: date,
                //dateref: dateref,
                //sample: sample,
                subgroups: { runinfo: runinfo }
            };
            

            for (const key in subgroupsItems) {
                const items = subgroupsItems[key] as object;
                const obj = data.subgroups[key] as object || {};

                let parseditems = {};
                for (const itemkey in items) {
                    const item = items[itemkey];
                    const key = item['item'];
                    if (item['description']) parseditems[key] = item['description']
                    else if (item[dateref]) parseditems[key] = item[dateref]
                    else parseditems[key] = '';
                }
                data.subgroups[key] = {...obj, ...parseditems};

            }

            runData.push(data);
            i++;
        });
    });

    // sort runData by reversed date (recent on top)
    runData = runData.sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
    });
    return runData;
}

function createTableContent(runData : RunData[], $table: HTMLTableElement) {
    const tableid = $table.id;
    const tablehead = $table.querySelector('thead') as HTMLTableSectionElement;
    const tablebody = $table.querySelector('tbody') as HTMLTableSectionElement;
    
    // get table header row
    let tableheadrow = tablehead.querySelector('tr') as HTMLTableRowElement;
    // if tableheadrow is null create tableheadrow
    if (!tableheadrow) {
        tableheadrow = document.createElement('tr');
        tablehead.appendChild(tableheadrow);
    }
        // Get Header text from data: runData to array of unique subgroup items keys
    const subgroups = runData.map((run) => {
        if (run.subgroups[tableid] == null) return [];
        return Object.keys(run.subgroups[tableid]);
    }).flat();
    const subgroupHeaders = [...new Set(subgroups)]; // remove duplicates
    
    // create table header html from subgroupHeaders
    let thhtml = '<th>Sample No.</th>';
    let tablebodyhtml = '';

    subgroupHeaders.forEach((key) => {
        thhtml += `<th>${key}</th>`;
    });
    tableheadrow.innerHTML = thhtml;    

    // create row for each runData
    runData.forEach((run) => {      
        const subgroupItems = run.subgroups[tableid] as object;
        tablebodyhtml += `<tr><td>${run.label}</td>`;       

        subgroupHeaders.forEach((key) => {
            let text = '';
            if (subgroupItems) {
                text = subgroupItems[key] || '';
            }
    
            tablebodyhtml += `<td>${text}</td>`;
        });

        tablebodyhtml += `</tr>`;
           
    });
    
    tablebody.innerHTML = tablebodyhtml;
    
}

export { UICreateExplorerPage as UICreateExplorerTable };