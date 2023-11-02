import { RunData } from "../Data/GetRunData";
import { HemeSampleItems } from "..";
import { selectElemFromGroup } from "../helpers/domElemHelper";
import { HemeSampleItem } from "../Data/HemeSampleItem";

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
export function UpdateSamplesPage(run: RunData, $container: HTMLLIElement) {
    //console.log(run);
            
    // get all div ids from $container #rowheader, including children
    const $ids = $container.querySelectorAll('.rowheader [id]');
    // clear all divs
    $ids.forEach((id) => {
        id.replaceChildren();
        id.classList.remove('selected');
    });
    
    // get div with id 'samplepage-id` and update innerHTML with run id
    const $samplepageid = $container.querySelector('#samplepage-id');
    $samplepageid.innerHTML = run.label.toString();

    // assign run info variables
    const runInfo = run.subgroups.runinfo as object;
    if (runInfo) {
        // get div with id 'samplepage-pn` and update w runinfo 'P /N'
        const $pn = $container.querySelector('#samplepage-pn');
        const pn_data = runInfo['P / N'] || '';
        const isPositive = pn_data.toLowerCase() == 'p';
        $pn.innerHTML = isPositive ? 'Positive' : 'Negative';
        if (isPositive) $pn.classList.add('selected');

        // get div with id 'samplepage-validated` and update w runinfo 'Validated'
        const $validated = $container.querySelector('#samplepage-validated');
        const validated_data = runInfo['Validated'] || '';
        const isValidated = validated_data.toLowerCase() == 'v';
        $validated.innerHTML = isValidated ? 'Validated' : 'Not Validated';
        if (isValidated) $validated.classList.add('selected');

        // get div with id 'samplepage-action` and update w runinfo 'Action'
        const $action = $container.querySelector('#samplepage-action');
        const isAction = runInfo['Action'].length > 0;
        $action.innerHTML = isAction ? 'Action' : '';
        if (isAction) $action.classList.add('selected');

        // get div with id 'samplepage-error` and update w runinfo 'Error'
        const $error = $container.querySelector('#samplepage-error');
        const isError = runInfo['Error'].length > 0;
        $error.innerHTML = isError ? 'Error' : '';
        if (isError) $error.classList.add('selected');

        const $none = $container.querySelector('#samplepage-none');
        
        if (!isAction && !isError) {
            $none.innerHTML = 'None';
            $none.classList.add('selected');
            
        }

        // get div with id 'samplepage-datetime` and update w runinfo Day,Time
        const $datetime = $container.querySelector('#samplepage-datetime');
        $datetime.innerHTML = runInfo['Day'] + ' ' + runInfo['Time'];
        
    }

    // assign patient info variables
    const patientinfo = run.subgroups.patientinfo; 
    if (patientinfo) {
        // get div with id 'samplepage-patientid` and update w patientinfo id
        const $samplepagepatientid = $container.querySelector('#samplepage-patientid');
        $samplepagepatientid.innerHTML = patientinfo['Patient id'];

        // get div with id 'samplepage-patientname` and update w patientinfo name
        const $samplepagepatientname = $container.querySelector('#samplepage-name');
        $samplepagepatientname.innerHTML = patientinfo['name'];
    }

    // populate CUMULATIVE tab page
    const itemid = run.id;
    const hemesample = HemeSampleItems.filter((item) => item.id == itemid)[0];
    const $cumulative = $container.querySelector('#'+subgroupNav.cumulative) as HTMLTableElement;
    if (hemesample && $cumulative) {
        UICumulativeSetup(hemesample, $cumulative);
    }
    // populate MAIN tab page table from haparams
    const dateref = run.dateref;
    const $main = $container.querySelector('#'+subgroupNav.main+' tbody') as HTMLTableElement;
    if (dateref && $main) {
        UIMainTableSetup(hemesample, $main, dateref);
    }

    // populate GRAPH tab page
    const $graph = $container.querySelector('#'+subgroupNav.graph+' tbody') as HTMLTableElement;
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
        var $tabcontent = $container.querySelector('#'+contentid) as HTMLElement;
        
        $tab.addEventListener('click', (e) => {   
            //console.log(contentid, $tabcontent);
            selectElemFromGroup($tab, $tabs);
            selectElemFromGroup($tabcontent, $tabcontents);
        });
    });

}

/** Create content for the Main table */
function UIMainTableSetup(paramdata: HemeSampleItem, $tbody: HTMLTableElement, dateref: string){ 
   // console.log(paramdata);
    // clear container
    $tbody.replaceChildren(); 
    // create tbody with rows for each parameter subgroup 'haparameter'
    // column 1 is label or item, column 2 is dateref value, column 3 is unit value
    let params = paramdata.GetSubgroup('haparameter');
    var n = 0;
    for (let param in params) {
        let item = params[param];
        let $tr = document.createElement('tr');
        let $td_item = document.createElement('td');
        let $td_date = document.createElement('td');
        let $td_unit = document.createElement('td');
        let label = item.label || item.item; 
        $td_item.innerHTML = label;
        $td_date.innerHTML = item[dateref] || '-';
        $td_unit.innerHTML = item.unit || '';
        $tr.appendChild($td_item);
        $tr.appendChild($td_date);
        $tr.appendChild($td_unit);
        $tbody.appendChild($tr);
        n++;
    }

}

/** Create content for the Cumulative table */
function UICumulativeSetup(paramdata: HemeSampleItem, $container: HTMLTableElement) { 
    const mincolumns = 10; // create at least 5 columns
    let analysisDates = paramdata.analysisDates;
    let params = paramdata.GetSubgroup('haparameter');
    //console.log(params);

    // clear container
    $container.replaceChildren();

    // create thead with two rows: 
    // - first row is dates, second row is time
    // - first column is 'Date', 'Time' followed by analysis dates
    let $thead = document.createElement('thead');
    let $tr1 = document.createElement('tr');
    let $tr2 = document.createElement('tr');
    let $th1 = document.createElement('th');
    let $th2 = document.createElement('th');
    $th1.innerHTML = 'Date';
    $th2.innerHTML = 'Time';
    $tr1.appendChild($th1);
    $tr2.appendChild($th2);
    analysisDates.forEach((date) => {
        let day = date.split(' ')[0];
        let time = date.split(' ')[1];
        let $th_day = document.createElement('th');
        let $th_time = document.createElement('th');
        $th_day.innerHTML = day;
        $th_time.innerHTML = time;
        $tr1.appendChild($th_day);
        $tr2.appendChild($th_time);
        
    });
    $thead.appendChild($tr1);
    $thead.appendChild($tr2);
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
        analysisDates.forEach((date,i) => {
            let $td = document.createElement('td');
            let dateref = i+1;
            let value = item['date'+dateref] || '-';
            $td.innerHTML = value;
            $tr.appendChild($td);
        });
        $tbody.appendChild($tr);
    }
    $container.appendChild($tbody);

    // add empty columns if there are less than 5 columns
    const $th = $thead.querySelectorAll('tr:first-child>th');  
    const numcols = $th.length;
    if (numcols < mincolumns) {
        let $tbodytrs = $tbody.querySelectorAll('tr');
        let $theadtrs = $thead.querySelectorAll('tr');
        let numemptycols = mincolumns - numcols;
        for (let i=0; i<numemptycols; i++) {
            
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

}

/** Create img for the Graph table */
function UIGraphSetup(run: RunData, $td: HTMLElement) {
    const images = run.subgroups.other as object; console.log(run.subgroups);
    
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
    const runinfo = paramdata.GetSubgroup('other'); 
    const n = $holder.querySelectorAll('tr').length;
    const $tr = $holder.querySelector('tr:first-child');

    let $td_flags = $tr.querySelector('._flags');
    // if no flags column, create one
    if (!$td_flags) {
        $td_flags = document.createElement('td');
        $td_flags.setAttribute('rowspan', n.toString());
        $td_flags.classList.add('_flags');
    }
    // clear flags column
    $td_flags.innerHTML = '';

    if (runinfo) {
        
        let txt = runinfo.flags? runinfo.flags[dateref]? runinfo.flags[dateref] : '' : '';
        if (txt.length >0) txt = txt.replace(/\n/g, '<br>');
        $td_flags.innerHTML = txt;
        $tr.appendChild($td_flags);
    }
}