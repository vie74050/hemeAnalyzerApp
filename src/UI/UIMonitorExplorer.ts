import { HemeSampleItem } from "../Data/HemeSampleItem";
import { selectElemFromGroup, UICreateElemFromString } from "../helpers/domElemHelper";

interface RunData {
    id: string | number,
    label: string,
    date: Date,
    subgroups: Record<string, string | object>
}

enum explorerNav {
    runinfo = 'runinfo',
    patientinfo = 'patientinfo',
    reagentinfo = 'reagentinfo'
}

function UICreateExplorerPage(
    hemeSamples: HemeSampleItem[], 
    $explorerpage: HTMLDivElement
){
    // get run data    
    const rundata = getRunData(hemeSamples); //console.log(rundata);
    let btngroup = [], tablegrp = [];

    // create explorer page
    let explorerhtml = require('./UIMonitorExplorer.html').default;    
        
    // get container elems from explorer page
    const $explorermenudiv = UICreateElemFromString(explorerhtml, 'div') as HTMLLIElement;
    $explorermenudiv.innerHTML = '';
    $explorerpage.appendChild($explorermenudiv);

    const $ul = UICreateElemFromString(explorerhtml, 'ul') as HTMLLIElement;
    $ul.innerHTML = '';   
    $explorermenudiv.appendChild($ul);

    const $btns = UICreateElemFromString(explorerhtml, 'span') as HTMLLIElement;
    $explorermenudiv.appendChild($btns);

    // for each explorerNav, create table from explorerhtml as template
    const $tablecontainerdiv = UICreateElemFromString(explorerhtml, 'div',1) as HTMLLIElement;
    $tablecontainerdiv.innerHTML = '';
    $explorerpage.appendChild($tablecontainerdiv);

    for (const key in explorerNav) {
        const nav = explorerNav[key];

        let _html = explorerhtml.replace(/\{\{id\}\}/g, nav); 
        let $btn_li = UICreateElemFromString(_html, 'li') as HTMLLIElement;
        let $table = UICreateElemFromString(_html, 'table') as HTMLTableElement;
        
        $btn_li.innerHTML = nav.replace('info', ' Info');
        $ul.appendChild($btn_li);

        $tablecontainerdiv.appendChild($table);
        createTableContent(rundata, $table);

        tablegrp.push($table);
        btngroup.push($btn_li);

        // tab selector event binding
        $btn_li.addEventListener('click', (e) => {
            selectElemFromGroup($btn_li, btngroup);
            selectElemFromGroup($table, tablegrp);
        
        });    
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
    // add seq to sorted runData runinfo
    runData.forEach((run, index) => {
        run.subgroups['runinfo']['Seq'] = runData.length - index;
    });

    return runData;
}

/** Fill specified table with data, based on tableid
 * @param runData: RunData[]
 * @param $table: HTMLTableElement
 * Require tableid to be the key specified in runData.subgroups
 */
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
    

    subgroupHeaders.forEach((key) => {
        thhtml += `<th>${key}</th>`;
    });
    tableheadrow.innerHTML = thhtml;    
    
    
    // create row for each runData
    runData.forEach((run, index) => {      
        const subgroupItems = run.subgroups[tableid] as object;
        const tr = document.createElement('tr');
        let trhtml = '';
        
        tr.id=run.id.toString();
        trhtml += `<td>${run.label}</td>`;       

        subgroupHeaders.forEach((key) => {
            let text = '';
            if (subgroupItems) {
                text = subgroupItems[key] || '';
            }
    
            trhtml += `<td>${text}</td>`;
        });
        tr.innerHTML = trhtml;
        
        tr.addEventListener('click', (e) => {
            console.log('clicked', run);
        });
        
        tablebody.appendChild(tr);   
    });
        
}

export { UICreateExplorerPage };