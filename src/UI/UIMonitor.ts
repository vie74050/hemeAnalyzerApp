import { hemeGroups } from "../Data/ParseRowsToHemeSample";
import { HemeSampleItem, QCSampleItem } from "../Data/HemeSampleItem";
import { UICreateQCTable } from "./UIMonitorQCFiles";
import { selectElemFromGroup } from "../helpers/selectElemHelper";

enum monitorNav {
    home = 'home',
    qcfiles = 'qcfiles',
    explorer = 'explorer',
    back = 'back'
}
let $backBtn: HTMLButtonElement,
    $qctable: HTMLTableElement, 
    $graphscontainer: HTMLElement,
    currentPage: string = monitorNav.home;

function UIMonitorSetUp(monitorId: string) {
    const monitorhtml = require('./UIMonitor.html').default;
    const $monitor = document.getElementById(monitorId) as HTMLDivElement;
    $monitor.innerHTML = monitorhtml;

    // specify dom elements for monitor
    const contentPages = $monitor.getElementsByClassName('content-page')as HTMLCollectionOf<HTMLElement>;
    const topbtns = $monitor.getElementsByTagName('button') as HTMLCollectionOf<HTMLButtonElement>;
    $graphscontainer = $monitor.querySelector('#graphscontainer') as HTMLElement;
    $qctable = $monitor.querySelector('#qcfiletable') as HTMLTableElement;

    // loop through monitorNav enum and get corresponding buttons from #top-menu
    for (let navId in monitorNav) {
        let btnelem = $monitor.querySelector(`#${navId}-btn`) as HTMLButtonElement;
        
        
        if (btnelem) {
           
            if (navId == 'back') {
                // reference for subpage navigation
                $backBtn = btnelem;               
            } 
                
            btnelem.addEventListener('click', () => {
                

                switch (navId) {
                    case monitorNav.back:
                        BackBtnHandler();
                        break;
                    case monitorNav.home:
                        currentPage = navId;
                        ShowHomePage();
                        break;
                    case monitorNav.qcfiles:
                        currentPage = navId;
                        ShowQCFilesTable();
                        break;
                    case monitorNav.explorer:
                        currentPage = navId;
                        ShowFileExplorer();
                        break;
                    default:
                        break;
                }
       
                let btn = $monitor.querySelector(`#${currentPage}-btn`) as HTMLElement;
                let pageelem = $monitor.querySelector(`#${currentPage}-page`) as HTMLElement;

                pageelem.scrollTop = 0;
                selectElemFromGroup(btn, Array.from(topbtns));
                selectElemFromGroup(pageelem, Array.from(contentPages));
                
            });

            
            
        }
    }
    
    ShowHomePage();

    return { $qctable, $backBtn, $graphscontainer };
}

function ShowHomePage() {
    
}

function ShowQCFilesTable() {
        
    // show $qctable
    $qctable.style.display = 'table';
    // clear graphs container
    $graphscontainer.innerHTML = '';

}

function ShowFileExplorer() {

}

function BackBtnHandler() {
    $backBtn.style.display = 'none';
    console.log(currentPage);
    switch (currentPage) {
        case monitorNav.qcfiles:
            ShowQCFilesTable();
            break;
        default:
            break;
    }

}


/** Method for setting up QC Tables after sheet data loaded on entry */
function UIQCTableSetUp(hemeSamples: HemeSampleItem[]) {
                
    // create QC table
    if ($qctable) {
        // filter hemeSamples for QC Samples
        const qcsamples = hemeSamples
                        .filter((sample) => sample.data.groups === hemeGroups.qc)
                        .map((sample) => sample as QCSampleItem);

        UICreateQCTable(qcsamples, $qctable);

    }   
}

function UIExplorerSetUp(hemeSamples: HemeSampleItem[]) {
    
    const columnsTitle = ['Sample No.', 'Date', 'Time', 'Seq'];
    let runData = [];

    // for each sample, get the run data
    hemeSamples.forEach((sample) => {
        let runDates = sample.analysisDates;
        let subgroups = sample.subgroups;
        runDates.forEach(datestring => {
            let date = new Date(datestring);
            
            runData.push({ 
                id: sample.label,
                'date': date
            });
        });
    });   

    // sort runData by reversed date (recent on top)
    runData = runData.sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
    });
    

    // create a table row for each runData within table id='explorertable' where keys are the headers
    let table = document.getElementById('explorertable') as HTMLTableElement;
    let tablebody = table.getElementsByTagName('tbody')[0];
    let tablehead = table.getElementsByTagName('thead')[0];
    let tableheadrow = tablehead.getElementsByTagName('tr')[0];
    let tableheadrowhtml = '';
    
    columnsTitle.forEach((key) => {
        tableheadrowhtml += `<th>${key}</th>`;
    });
    tableheadrow.innerHTML = tableheadrowhtml;
    let tablebodyhtml = '';
    runData.forEach((run, i) => {
        let runDate = run.date.toLocaleDateString("en-US");
        let runTime = run.date.toLocaleTimeString();
        let seq = runData.length - i;
        tablebodyhtml += `<tr>
            <td>${run.id}</td>
            <td>${runDate}</td>
            <td>${runTime}</td>
            <td>${seq}</td>
            </tr>`;
    });
    tablebody.innerHTML = tablebodyhtml;    

    console.log(hemeSamples);
}

export { UIMonitorSetUp, UIQCTableSetUp, $graphscontainer, $backBtn, UIExplorerSetUp };