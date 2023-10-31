import { selectElemFromGroup } from "../helpers/domElemHelper";
import { hemeGroups, CreateHemeSamplesFromRowData } from "../Data/ParseRowsToHemeSample";
import { QCSampleItem } from "../Data/HemeSampleItem";
import { UICreateQCTable } from "./UIMonitorQCFiles";
import { UICreateExplorerPage } from "./UIMonitorExplorer";

enum monitorNav {
    home = 'home',
    qcfiles = 'qcfiles',
    explorer = 'explorer',
    back = 'back'
}

const monitorhtml = require('./UIMonitor.html').default;
let $backBtn: HTMLButtonElement = null,
    topbtns: HTMLCollectionOf<HTMLButtonElement> = null,
    contentPages: HTMLCollectionOf<HTMLElement> = null,
    currentPage: string = monitorNav.home;

/** Method for setting up monitor page
 * @param monitorId id of monitor container div 
 */
function UIMonitorSetUp(monitorId: string) {
    
    const $monitor = document.getElementById(monitorId) as HTMLDivElement;
    $monitor.innerHTML = monitorhtml;   
    
    topbtns = $monitor.getElementsByTagName('button') as HTMLCollectionOf<HTMLButtonElement>;
    contentPages = $monitor.getElementsByClassName('content-page')as HTMLCollectionOf<HTMLElement>;
    
    // loop through monitorNav enum and get corresponding buttons from #top-menu
    for (let navId in monitorNav) {
        let btnelem = $monitor.querySelector(`#${navId}-btn`) as HTMLButtonElement;
                
        if (btnelem) {
           
            if (navId == 'back') {
                // reference for subpage navigation
                $backBtn = btnelem;               
            } 
                
            btnelem.addEventListener('click', () => {
                $backBtn.style.display = 'none';
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

    return { $backBtn };
}

// EVENT HANDLERS

function ShowHomePage() {
    
}

function ShowQCFilesTable() {
    const $qccontentpage = contentPages.namedItem(monitorNav.qcfiles+'-page') as HTMLDivElement;
    $qccontentpage.dispatchEvent(new Event('reset'));
}

function ShowFileExplorer() {
    const $explorerpage = contentPages.namedItem(monitorNav.explorer+'-page') as HTMLDivElement;
    $explorerpage.dispatchEvent(new Event('reset'));    
}

function BackBtnHandler() {
    
    //console.log(currentPage);
    switch (currentPage) {
        case monitorNav.home:
            ShowHomePage();
            break;
        case monitorNav.qcfiles:
            ShowQCFilesTable();
            break;
        case monitorNav.explorer:
            ShowFileExplorer();
            break;
        default:
            break;
    }

}

// EXPORTED FUNTIONS FOR SETUP

/** For setting up QC Tables, called when sheetdata loaded */
function UIQCTableSetUp(data: Record<string, string>[]) {
    const hemeSamples = CreateHemeSamplesFromRowData(data);
    const $qccontentpage = contentPages.namedItem(monitorNav.qcfiles+'-page') as HTMLDivElement;
    // create QC table
    if ($qccontentpage) {
        // filter hemeSamples for QC Samples
        const qcsamples = hemeSamples
                        .filter((sample) => sample.data.groups === hemeGroups.qc)
                        .map((sample) => sample as QCSampleItem);

        UICreateQCTable(qcsamples, $qccontentpage);

    }   
}

/** For setting up Explorer page, called when sheetdata loaded */
function UIExplorerSetUp(data: Record<string, string>[]) {
    const hemeSamples = CreateHemeSamplesFromRowData(data);
    const $explorerpage = contentPages.namedItem(monitorNav.explorer+'-page') as HTMLDivElement;
    
    if ($explorerpage) {
        UICreateExplorerPage(hemeSamples, $explorerpage);
    }
}

export { UIMonitorSetUp, UIQCTableSetUp, $backBtn, UIExplorerSetUp };