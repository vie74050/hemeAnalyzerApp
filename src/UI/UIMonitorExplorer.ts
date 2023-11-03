import { HemeSampleItem } from "../Data/HemeSampleItem";
import { selectElemFromGroup, UICreateElemFromString } from "../helpers/domElemHelper";
import { RunData, GetRunData } from "../Data/GetRunData";
import { Modal_UICreateSearch } from "./modals/UISearch";
import { Modal_UICreateAlerts } from "./modals/UIAlerts";
import { $backBtn } from "./UIMonitor";
import { UpdateSamplesPage } from "./UIMonitorExplorerSamples";

enum explorerNav {
    runinfo = 'runinfo',
    patientinfo = 'patientinfo',
    reagentinfo = 'reagentinfo'
}
enum rowDataAttributes {
    id = 'id',
    label = 'label',
    patientid = 'Patient id',
    patientname = 'name'
}
// create explorer page
const explorerhtml = require('./UIMonitorExplorer.html').default;
const sampleshtml = require('./UIMonitorExplorerSamples.html').default;
// get container elems from explorer page
const $explorermenudiv = UICreateElemFromString(explorerhtml, 'div') as HTMLLIElement;
const $tablecontainerdiv = UICreateElemFromString(explorerhtml, 'div', 1) as HTMLLIElement;
const $subpagecontainerdiv = UICreateElemFromString(explorerhtml, 'div', 2) as HTMLLIElement;

let $maincontainerdiv: HTMLDivElement = null;
let $alerts: HTMLElement = null;

/** Gets the html template and creates the elements for Exploerer page:
 * - creates a `<ul><li>` for each nav button as tabs
 * - creates a `<table>` for each nav button as content target
 * 
 * @param hemeSamples: HemeSampleItem[], the parsed from sheet
 * @param $explorerpage: HTMLDivElement, target container for explorer page
 */
function UICreateExplorerPage(
    hemeSamples: HemeSampleItem[],
    $explorerpage: HTMLDivElement
) {
    // get run data    
    const rundata = GetRunData(hemeSamples); //console.log(rundata);
    let btngroup = [], tablegrp = [];

    $maincontainerdiv = document.createElement('div');
    $maincontainerdiv.classList.add('main-div');
    $explorerpage.appendChild($maincontainerdiv);

    // set up tabs
    $explorermenudiv.innerHTML = '';
    const $ul = UICreateElemFromString(explorerhtml, 'ul') as HTMLLIElement;
    $ul.innerHTML = '';
    $explorermenudiv.appendChild($ul);
    $maincontainerdiv.appendChild($explorermenudiv);

    // set up table: for each explorerNav, create table from explorerhtml as template
    $tablecontainerdiv.innerHTML = '';
    $maincontainerdiv.appendChild($tablecontainerdiv);

    // create a `li` tab and `table` for each nav
    for (const key in explorerNav) {
        const nav = explorerNav[key];

        let _html = explorerhtml.replace(/\{\{id\}\}/g, nav);
        let $btn_li = UICreateElemFromString(_html, 'li') as HTMLLIElement;
        let $table = UICreateElemFromString(_html, 'table') as HTMLTableElement;

        $btn_li.innerHTML = nav.replace('info', ' Info');
        $ul.appendChild($btn_li);

        $tablecontainerdiv.appendChild($table);
        UIcreateTableContent(rundata, $table);

        tablegrp.push($table);
        btngroup.push($btn_li);

        // tab selector event binding
        $btn_li.addEventListener('click', (e) => {
            selectElemFromGroup($btn_li, btngroup);
            selectElemFromGroup($table, tablegrp);

        });
    }

    // set html for samples' subpage
    $subpagecontainerdiv.innerHTML = sampleshtml;
    $subpagecontainerdiv.style.display = 'none'; // hide initially
    $explorerpage.appendChild($subpagecontainerdiv);

    // set default selected button
    selectElemFromGroup(btngroup[0], btngroup);
    selectElemFromGroup(tablegrp[0], tablegrp);

    // option buttons
    const $btns = UICreateElemFromString(explorerhtml, 'span') as HTMLLIElement;
    $explorermenudiv.appendChild($btns);
    // add SEARCH MODAL to explorer page
    const $searchEl = Modal_UICreateSearch($tablecontainerdiv, rowDataAttributes);
    $explorerpage.appendChild($searchEl);

    //add custom event to listen for $explorerpage reset
    $explorerpage.addEventListener('reset', () => {
        resetPage();
    });

    // add ALERTS MODAL to explorer page
    $alerts = Modal_UICreateAlerts();
    $explorerpage.appendChild($alerts);
}

/** Fill specified table with data, based on tableid:
 * - creates a `<tr>` for each runData
 * - creates `<td>` for each value in runData.subgroups[tableid]
 * @param runData: RunData[]
 * @param $table: HTMLTableElement
 * Require tableid to be the key specified in runData.subgroups
 */
function UIcreateTableContent(runData: RunData[], $table: HTMLTableElement) {
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

    // create tr for each runData
    runData.forEach((run, index) => {
        const subgroupItems = run.subgroups[tableid] as object;
        const tr = document.createElement('tr');
        let trhtml = '';

        let patientinfo = { id: run.id, label: run.label };
        if (run.subgroups['patientinfo']) {
            patientinfo = { ...patientinfo, ...run.subgroups['patientinfo'] as object };
        }
        // tag rows with searchable attributes
        for (const key in rowDataAttributes) {
            const attr = rowDataAttributes[key];
            let value = patientinfo[attr];
            if (value) {
                tr.setAttribute(`data-${key}`, value.scrub());
            }

        }

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
            trClickHandler(run);
        });

        tablebody.appendChild(tr);
    });

}

// EVENT HANDLERS

/** <tr> click handler when item row is clicked */
function trClickHandler(run: RunData) {
    $maincontainerdiv.style.display = 'none'; // hide table
    $subpagecontainerdiv.style.display = 'block'; // show samples page
    $backBtn.style.display = 'inline-block'; // show back

    UpdateSamplesPage(run, $subpagecontainerdiv, $alerts);
}

/** handle explorer page reset event */
function resetPage() {
    $maincontainerdiv.style.display = 'block'; // show table
    $subpagecontainerdiv.style.display = 'none'; // hide samples page
    $backBtn.style.display = 'none'; // hide back

    // get elems with class `hilight` and remove the class
    const hilights = document.getElementsByClassName('hilight');
    Array.from(hilights).forEach((elem) => elem.classList.remove('hilight'));
}

export { UICreateExplorerPage };