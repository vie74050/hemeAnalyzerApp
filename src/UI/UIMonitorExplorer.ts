import { HemeSampleItem } from "../Data/HemeSampleItem";
import { HemeSampleItems } from "..";
import { selectElemFromGroup, UICreateElemFromString } from "../helpers/domElemHelper";
import { RunData, GetRunData, GetRunDatum } from "../Data/GetRunData";
import { $backBtn, $alertsModal, $runstatusModal } from "./UIMonitor";
import { UpdateSamplesPage } from "./UIMonitorExplorerSamples";

enum explorerNav {
    runinfo = 'runinfo',
    patientinfo = 'patientinfo',
    reagentinfo = 'reagentinfo'
}
export enum rowDataAttributes { // data attributes that search uses
    id = 'id',
    label = 'label',
    patientid = 'Patient id',
    patientname = 'name'
}
// create explorer page
const explorerhtml = require('./UIMonitorExplorer.html').default;
const sampleshtml = require('./UIMonitorExplorerSamples.html').default;

let explorerpages: DataExplorer[] = [];

export class DataExplorer {
    private $maincontainerdiv: HTMLDivElement;
    private $alertsmodal: HTMLElement;
    private $runstatusmodal: HTMLElement;
    private $explorermenudiv: HTMLLIElement;
    private $tablecontainerdiv: HTMLLIElement;
    private $subpagecontainerdiv: HTMLLIElement;
    private DataItems: HemeSampleItem[];

    constructor(hemeSamples: HemeSampleItem[], $parentpage: HTMLDivElement) {
        this.$alertsmodal = $alertsModal;
        this.$runstatusmodal = $runstatusModal;
        this.$explorermenudiv = UICreateElemFromString(explorerhtml, 'div') as HTMLLIElement;
        this.$tablecontainerdiv = UICreateElemFromString(explorerhtml, 'div', 1) as HTMLLIElement;
        this.$subpagecontainerdiv = UICreateElemFromString(explorerhtml, 'div', 2) as HTMLLIElement;
        this.UICreateExplorerPage(hemeSamples, $parentpage);
        explorerpages.push(this);
    }
    /** Gets the html template and creates the elements for Exploerer page:
     * - creates a `<ul><li>` for each nav button as tabs
     * - creates a `<table>` for each nav button as content target
     * 
     * @param hemeSamples: HemeSampleItem[], the parsed from sheet
     * @param $parentpage: HTMLDivElement, target container for explorer page
     */
    public UICreateExplorerPage(hemeSamples: HemeSampleItem[], $parentpage: HTMLDivElement) {
        const $explorermenudiv = this.$explorermenudiv;
        const $tablecontainerdiv = this.$tablecontainerdiv;
        const $subpagecontainerdiv = this.$subpagecontainerdiv;

        // get run data    
        const rundata = GetRunData(hemeSamples); //console.log(rundata);
        let btngroup = [], tablegrp = [];

        this.$maincontainerdiv = document.createElement('div');
        this.$maincontainerdiv.classList.add('main-div');
        $parentpage.appendChild(this.$maincontainerdiv);

        // set up tabs
        $explorermenudiv.innerHTML = '';
        const $ul = UICreateElemFromString(explorerhtml, 'ul') as HTMLLIElement;
        $ul.innerHTML = '';
        $explorermenudiv.appendChild($ul);
        this.$maincontainerdiv.appendChild($explorermenudiv);

        // set up table: for each explorerNav, create table from explorerhtml as template
        $tablecontainerdiv.innerHTML = '';
        this.$maincontainerdiv.appendChild($tablecontainerdiv);

        // create a `li` tab and `table` for each nav
        for (const key in explorerNav) {
            const nav = explorerNav[key];

            let _html = explorerhtml.replace(/\{\{id\}\}/g, nav);
            let $btn_li = UICreateElemFromString(_html, 'li') as HTMLLIElement;
            let $table = UICreateElemFromString(_html, 'table') as HTMLTableElement;

            $btn_li.innerHTML = nav.replace('info', ' Info');
            $ul.appendChild($btn_li);

            $tablecontainerdiv.appendChild($table);
            this.UIcreateTableContent(rundata, $table);

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
        $parentpage.appendChild($subpagecontainerdiv);

        // set default selected button
        selectElemFromGroup(btngroup[0], btngroup);
        selectElemFromGroup(tablegrp[0], tablegrp);

        // option buttons
        const $btns = UICreateElemFromString(explorerhtml, 'span') as HTMLLIElement;
        $explorermenudiv.appendChild($btns);
        
        // ADD EVENT LISTENERS
        // $explorerpage reset
        $parentpage.addEventListener('reset', () => {
            this.resetPage();
        });

        // updateValidated event
        document.addEventListener('updateValidated',  function(e: CustomEvent) {
            if( e.detail ) {
                let attr = e.detail.id + e.detail.dateref;
                let $tds = document.querySelectorAll(`td[data-validated="${attr}"]`);
                $tds.forEach(($td) => {
                    $td.innerHTML = 'V';
                    $td.classList.add('text-success');
                });
            }
            console.log(tablegrp, e.detail);

        });

       this.DataItems = hemeSamples;
    }

    /** Fill specified table with data, based on tableid:
     * - creates a `<tr>` for each runData
     * - creates `<td>` for each value in runData.subgroups[tableid]
     * @param runData: RunData[]
     * @param $table: HTMLTableElement
     * Require tableid to be the key specified in runData.subgroups
     */
    private UIcreateTableContent(runData: RunData[], $table: HTMLTableElement) {
        const tableid = $table.dataset.id;
        const tablehead = $table.querySelector('thead') as HTMLTableSectionElement;
        const tablebody = $table.querySelector('tbody') as HTMLTableSectionElement;
    
        tablehead.innerHTML = ''; // clear table head
        tablebody.innerHTML = ''; // clear table body
    
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
            let tr = this.UI_CreateTableRow(run, subgroupHeaders, $table);
            tablebody.appendChild(tr);
        });
    
    }

    /** Create table row from rundata */
    private UI_CreateTableRow(run: RunData, columnHeadKey: string[], $table: HTMLTableElement): HTMLTableRowElement {
        const tableid = $table.dataset.id;
        const subgroupItems = run.subgroups[tableid] as object;
        const tr = document.createElement('tr');
        
        // add an extra column to each row for spacer
        const spacer = document.createElement('td');
        spacer.classList.add('spacer');
    
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
    
        const td1 = document.createElement('td');
        td1.innerHTML = run.label;
        tr.appendChild(td1);
    
        columnHeadKey.forEach((key) => {
            let td = document.createElement('td');
            let text = '';
            if (subgroupItems) {
                text = subgroupItems[key] || '';
                
                if (key === 'Validated') {
                    
                    td.setAttribute('data-validated', run.id.toString() + run.dateref.toString());
                    text = text.toLowerCase().includes('v') ? 'V' : ' ';
                }
            }
            td.innerHTML = text;
            tr.appendChild(td);
           
        });
    
        tr.appendChild(spacer);
    
        tr.addEventListener('click', (e) => {
            this.trClickHandler(run);
        });
    
        return tr;
    }

    // EVENT HANDLERS

    /** <tr> click handler when item row is clicked */
    private trClickHandler(runref: RunData,) {
        const hemesample = HemeSampleItems.filter((item) => item.id == runref.id)[0]; 
        const dateref = runref.dateref;
        const run: RunData = GetRunDatum(hemesample, runref.date, dateref);         
        const $maincontainerdiv = this.$maincontainerdiv;
        const $subpagecontainerdiv = this.$subpagecontainerdiv;
        const $alertsmodal = this.$alertsmodal;
        const $runstatusmodal = this.$runstatusmodal;

        $maincontainerdiv.style.display = 'none'; // hide table
        $subpagecontainerdiv.style.display = 'block'; // show samples page
        $backBtn.style.display = 'inline-block'; // show back

        UpdateSamplesPage(run, $subpagecontainerdiv, $alertsmodal, $runstatusmodal);
    }

    /** handle explorer page reset event */
    private resetPage() {
        const $maincontainerdiv = this.$maincontainerdiv;
        const $subpagecontainerdiv = this.$subpagecontainerdiv;
        $maincontainerdiv.style.display = 'block'; // show table
        $subpagecontainerdiv.style.display = 'none'; // hide samples page
        $backBtn.style.display = 'none'; // hide back

        // get elems with class `hilight` and remove the class
        const hilights = document.getElementsByClassName('hilight');
        Array.from(hilights).forEach((elem) => elem.classList.remove('hilight'));
    }

    public UI_AddDataRow(id: string) {
        const DataItems = this.DataItems;
        const $tablecontainerdiv = this.$tablecontainerdiv;

        const item = DataItems.find(item => item.id === id);    //console.log("explorer", rundata, item);

        if (item) {
            if (item.analysisDate != item.presenting) {
                item.addPresentingAsNewRun();
                //console.log("updated data: ", item);
            }
        }
        
        // update tables
        const rundata = GetRunData(DataItems); 
        const $tables = $tablecontainerdiv.querySelectorAll('table');
        $tables.forEach(($table) => {
            this.UIcreateTableContent(rundata, $table);
        });

    }
}

export function  Explorer_AddDataRow(id: string) {
    // update all explorer pages
    explorerpages.forEach((page) => {
        page.UI_AddDataRow(id);
    });
}