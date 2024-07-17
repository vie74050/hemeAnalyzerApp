import { RunData } from "../Data/GetRunData";
import { HemeSampleItems } from "..";
import { selectElemFromGroup } from "../helpers/domElemHelper";
import { HemeSampleItem } from "../Data/HemeSampleItem";
import { IDetails as IAlertDetails} from "./modals/UIAlerts";

enum subgroupNav {
    main = 'samplepage-main',
    graph = 'samplepage-graph',
    cumulative = 'samplepage-cumulative'
}

/** Updates the samples page with the run data
 * 
 * @param run: RunData, the run data
 * @param $container: HTMLLIElement, the target container
 */
export function UpdateSamplesPage(
    run: RunData, 
    $container: HTMLLIElement, 
    $alertsmodal: HTMLElement, 
    $runvalidationmodal: HTMLElement
    ) {    //console.log(run);
    
    const itemid = run.id;
    const hemesample = HemeSampleItems.filter((item) => item.id == itemid)[0];
    
    // get all div ids from $container #rowheader, including children
    const $ids = $container.querySelectorAll('.rowheader [id]');
    // clear all divs
    $ids.forEach((id) => {
        id.replaceChildren();
        id.classList.remove('selected');
    });

    // get div with id 'samplepage-id` and update innerHTML with run id
    const $samplepageid = $container.querySelector('#samplepage-id');
    $samplepageid.innerHTML = run.id.toString();

    // assign run info variables
    const runInfo = run.subgroups.runinfo as object; 
    //console.log(runInfo);
    if (runInfo) {
        //*** RUN STATUS **********************************************************//

        // get div with id 'samplepage-pn` and update w runinfo 'P /N'
        const $pn = $container.querySelector('#samplepage-pn');
        const pn_data = runInfo['P / N'] || '';
        const isPositive = pn_data.scrub() == 'p';
        $pn.innerHTML = isPositive ? 'Positive' : 'Negative';
        if (isPositive) $pn.classList.add('selected');

        // get div with id 'samplepage-validated` and update w runinfo 'Validated'
        const $validated = $container.querySelector('#samplepage-validated');           
        $runvalidationmodal.dispatchEvent(new CustomEvent('updatemodal', { detail: 
            {
                id: run.id,
                dateref: run.dateref,
                runinfo: runInfo, 
                $elem: $validated
            } 
        }));

        //*** RUN ALERTS ************************************************************//

        // get div with id 'samplepage-action` and update w runinfo 'Action'
        const $action = $container.querySelector('#samplepage-action');
        const isAction = runInfo['Action']?.length > 0 || false;
        $action.innerHTML = isAction ? 'Action' : '';
        if (isAction) $action.classList.add('selected');

        // get div with id 'samplepage-error` and update w runinfo 'Error'
        const $error = $container.querySelector('#samplepage-error');
        const isError = runInfo['Error']?.length > 0 || false;
        $error.innerHTML = isError ? 'Error' : '';
        if (isError) $error.classList.add('selected');

        const $none = $container.querySelector('#samplepage-none');

        if (!isAction && !isError) {
            $none.innerHTML = 'None';
            $none.classList.add('selected');
        }

        // update alerts modal content
        let details: IAlertDetails = {
            actions: runInfo['Action'],
            errors: runInfo['Error']
        };
        $alertsmodal.dispatchEvent(new CustomEvent('updatemodal', { detail: details }));

        // get div with id 'samplepage-datetime` and update w runinfo Day,Time
        const $datetime = $container.querySelector('#samplepage-datetime');
        $datetime.innerHTML = runInfo['Day'] + ' ' + runInfo['Time'];

    }

    // assign patient info variables
    const patientinfo = run.subgroups.patientinfo;
    if (patientinfo) {
        // get div with id 'samplepage-patientid` and update w patientinfo id
        const $samplepagepatientid = $container.querySelector('#samplepage-patientid');
        $samplepagepatientid.innerHTML = patientinfo['MRN'];

        // get div with id 'samplepage-patientname` and update w patientinfo name
        const $samplepagepatientname = $container.querySelector('#samplepage-name');
        $samplepagepatientname.innerHTML = patientinfo['Last Name'] + ", " + patientinfo['First Name'];
    }

    //*** populate CUMULATIVE tab page *************************************************************// 
    
    const $cumulative = $container.querySelector('#' + subgroupNav.cumulative) as HTMLTableElement;
    if (hemesample && $cumulative) {
        UICumulativeSetup(hemesample, $cumulative);
    }
    //*** populate MAIN tab page table from haparams ***********************************************//
    const dateref = run.dateref;
    const $main = $container.querySelector('#' + subgroupNav.main + ' tbody') as HTMLTableElement;
    if (dateref && $main) {
        UIMainTableSetup(hemesample, $main, dateref);
    }

    //*** populate GRAPH tab page *****************************************************************//
    const $graph = $container.querySelector('#' + subgroupNav.graph + ' tbody') as HTMLTableElement;
    const $graph_imgholder = $container.querySelector('#graph') as HTMLTableElement;
    if (run && $graph_imgholder) {
        UIGraphSetup(run, $graph_imgholder);
    }

    // add FLAGS to MAIN and GRAPH
    if (hemesample && dateref && $main) {
        UIFlags(hemesample, dateref, $main);
        UIFlags(hemesample, dateref, $graph);
    }


    // Set up tabs and association to tab content
    const $tabs = [...$container.querySelectorAll('.tab')] as HTMLElement[];
    const $tabcontents = [...$container.querySelectorAll('.content-page')] as HTMLElement[];
    selectElemFromGroup($tabs[0], $tabs);
    selectElemFromGroup($tabcontents[0], $tabcontents);
    // add event listener to tabs
    $tabs.forEach(($tab) => {
        var contentid = $tab.id.replace('-tab', '');
        var $tabcontent = $container.querySelector('#' + contentid) as HTMLElement;

        $tab.addEventListener('click', (e) => {
            //console.log(contentid, $tabcontent);
            selectElemFromGroup($tab, $tabs);
            selectElemFromGroup($tabcontent, $tabcontents);
        });
    });

}

/** Create content for the Main table */
function UIMainTableSetup(paramdata: HemeSampleItem, $tbody: HTMLTableElement, dateref: string) {
    // console.log(paramdata);
    // clear container
    $tbody.replaceChildren();
    // create tbody with rows for each parameter subgroup 'haparameter'
    // column 1 is label or item, column 2 is dateref value, column 3 is unit value
    let params = paramdata.GetItemsOfSubgroup('haparameter');
    var n = 0;
    for (let param in params) {
        let item = params[param];
        let $tr = document.createElement('tr');
        let $td_item = document.createElement('td');
        let $td_range = document.createElement('td');
        let $td_data = document.createElement('td');
        let $td_unit = document.createElement('td');
        let label = item.label || item.item;
        $td_item.innerHTML = label;
        $td_range.innerHTML = getRange(item[dateref],item) || '';
        $td_data.innerHTML = item[dateref] || '-';
        $td_unit.innerHTML = item.unit || '';
        $tr.appendChild($td_item);
        $tr.appendChild($td_range);
        $tr.appendChild($td_data);
        $tr.appendChild($td_unit);

        $td_range.classList.add('col-narrow');
        $tbody.appendChild($tr);
        n++;
    }

}

/** Create content for the Cumulative table */
function UICumulativeSetup(paramdata: HemeSampleItem, $container: HTMLTableElement) {
    const mincolumns = 10; // create at least 5 columns
    let analysisDates = paramdata.analysisDates;
    let params = paramdata.GetItemsOfSubgroup('haparameter');
    //console.log(params);

    // clear container
    $container.replaceChildren();

    // create thead with two rows: 
    // - first row is dates, second row is time
    // - first column is 'Date', 'Time' followed by analysis dates
    let $thead = document.createElement('thead');
    let $tr1 = document.createElement('tr');
    let $th1 = document.createElement('th');
    $th1.innerHTML = 'Date <br>Time';
    $tr1.appendChild($th1);

    // reverse analysis dates so most recent is first
    analysisDates = analysisDates.reverse();

    analysisDates.forEach((date) => {
        let daytime = date.replace(' ','<br/>');
        let $th_day = document.createElement('th');
        $th_day.innerHTML = daytime;
        $tr1.appendChild($th_day);

    });
    $thead.appendChild($tr1);
    $container.appendChild($thead);

    // create tbody with rows for each parameter
    let $tbody = document.createElement('tbody');
    for (let param in params) {
        let item = params[param];
        let $tr = document.createElement('tr');
        let $td = document.createElement('td');
        let label = item.label || item.item;
        $td.innerHTML = label;
        $tr.appendChild($td);
        analysisDates.forEach((date, i) => {
            let $td = document.createElement('td');
            let dateref = analysisDates.length - i;
            let value = item['date' + dateref] || '-';
            $td.innerHTML = value;
            $tr.appendChild($td);
        });
        $tbody.appendChild($tr);
    }
    $container.appendChild($tbody);

    // add empty columns if there are less than mincolumns
    const $th = $thead.querySelectorAll('tr:first-child>th');
    const numcols = $th.length;
    if (numcols <= mincolumns) {
        let $tbodytrs = $tbody.querySelectorAll('tr');
        let $theadtrs = $thead.querySelectorAll('tr');
        let numemptycols = mincolumns - numcols;
        for (let i = 0; i < numemptycols; i++) {

            $tbodytrs.forEach(($tr) => {
                let $td = document.createElement('td');
                $td.innerHTML = '';
                $tr.appendChild($td);
            });
            $theadtrs.forEach(($tr) => {
                let $th = document.createElement('th');
                $th.innerHTML = '';
                $tr.appendChild($th);
            });
        }
    }

    // add extra emtpy column to thead
    let $th_empty = document.createElement('th');
    $th_empty.innerHTML = '';
    $tr1.appendChild($th_empty);
}

/** Create img for the Graph table */
function UIGraphSetup(run: RunData, $td: HTMLElement) {
    const images = run.subgroups.other as object; //console.log(run.subgroups);

    $td.replaceChildren();
    if (images) {
        const $img = document.createElement('img');
        const graph = images['Graph'] as string || '';
        $img.src = graph;
        $td.appendChild($img);
    }
}

/** Gets flags from dateref and adds it to a column */
function UIFlags(paramdata: HemeSampleItem, dateref, $holder: HTMLTableElement) {
    const runinfo = paramdata.GetItemsOfSubgroup('other');
    const n = $holder.querySelectorAll('tr').length;
    const $tr = $holder.querySelector('tr:first-child');

    let $td_flags = $tr.querySelector('._flags');
    // if no flags column, create one
    if (!$td_flags) {
        $td_flags = document.createElement('td');
        $td_flags.setAttribute('rowspan', n.toString());
        $td_flags.classList.add('_flags');
        $tr.appendChild($td_flags);
    }
    // clear flags column
    $td_flags.innerHTML = '';

    if (runinfo) {

        let txt = runinfo.flags ? runinfo.flags[dateref] ? runinfo.flags[dateref] : '' : '';
        if (txt.length > 0) txt = txt.replace(/\n/g, '<br>');
        $td_flags.innerHTML = txt;

    }
}

/** Check value within range and return flag label to use in table.
 * L = low, H = high, N = normal, cL = critical low, cH = critical high
 * @param data - the value to check
 * @param item - the item to check against
 * @returns string, 'L', 'H', ' ', 'cL', 'cH'
 */
function getRange(data: string | number, item: Record<string,string>): string {
    //console.log(item);
    enum flagOptions {
        L = 'L',
        H = 'H',
        N = ' ',
        cL = 'cL',
        cH = 'cH'   
    }
    let value = Number(data);
    let min = Number(item.allowedmin);
    let max = Number(item.allowedmax);
    let criticalmin = Number(item.criticalmin);
    let criticalmax = Number(item.criticalmax);
    let flag = '';
    if (value < min) flag = flagOptions.L;
    if (value > max) flag = flagOptions.H;
    if (value >= min && value <= max) flag = flagOptions.N;
    if (value < criticalmin) flag = flagOptions.cL;
    if (value > criticalmax) flag = flagOptions.cH;

    if (flag != flagOptions.N) {
        console.log(item.item, value, min, max, criticalmin, criticalmax);
    }
    return flag;
}