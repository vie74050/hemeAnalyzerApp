import { selectElemFromGroup } from "../helpers/domElemHelper";
import { hemeGroups } from "../Data/ParseRowsToHemeSample";
import { HemeSampleItem, QCSampleItem } from "../Data/HemeSampleItem";
import { UICreateQCTable } from "./UIMonitorQCFiles";
import { DataExplorer, rowDataAttributes } from "./UIMonitorExplorer";
import { UICreateHomePage } from "./UIMonitorHome";
import { UIBottomSetup } from "./UIMonitorBottom";
import { Modal_UICreateSearch } from "./modals/UISearch";
import { Modal_UICreateRunValidation } from "./modals/UIRunValidation";
import { Modal_UICreateAlerts } from "./modals/UIAlerts";

enum monitorNav {
    home = 'home',
    qcfiles = 'qcfiles',
    explorer = 'explorer',
    samples = 'samples',
    back = 'back'
}

const monitorhtml = require('./UIMonitor.html').default;
let $backBtn: HTMLButtonElement = null,
    topbtns: HTMLCollectionOf<HTMLButtonElement> = null,
    contentPages: HTMLCollectionOf<HTMLElement> = null,
    currentPage: string = monitorNav.home,
    $searchElModal: HTMLElement = null, 
    $alertsModal: HTMLElement = null,
    $runValidationModal: HTMLElement = null;

// getter and setter for currentPage to call SelectCurrentPage() when currentPage is set
Object.defineProperty(this, 'currentPage', {
    get: () => currentPage,
    set: (value: string) => {
        SelectCurrentPage();  //console.log(value, currentPage);
    }
});

/** Method for setting up monitor page
 * @param monitorId id of monitor container div 
 */
function UIMonitorSetUp(monitorId: string) {

    const $monitor = document.getElementById(monitorId) as HTMLDivElement;
    $monitor.innerHTML = monitorhtml;

    topbtns = $monitor.getElementsByTagName('button') as HTMLCollectionOf<HTMLButtonElement>;
    contentPages = $monitor.getElementsByClassName('content-page') as HTMLCollectionOf<HTMLElement>;

    // loop through monitorNav enum and get corresponding buttons from #top-menu
    for (let navId in monitorNav) {
        let btnelem = $monitor.querySelector(`#${navId}-btn`) as HTMLButtonElement;
        // start with home page
        if (navId == 'home') {
            UIHomeSetUp();
        }

        if (btnelem) {
            if (navId == 'back') {
                // reference for subpage navigation
                $backBtn = btnelem;
                // add event listener back btn
                btnelem.addEventListener('click', () => {
                    SelectCurrentPage();
                });
            } else {
                // add event listener to each nav button
                btnelem.addEventListener('click', () => {
                    SetCurrentPage(navId);
                });
            }
        }
    }

    SelectCurrentPage();

    // bottom analyzer HUD setup
    UIBottomSetup($monitor.querySelector('#bot-menu') as HTMLElement);

    // add SEARCH MODAL to content page
    $searchElModal = Modal_UICreateSearch(rowDataAttributes);
    $monitor.appendChild($searchElModal);

    // add RUN VALIDATION MODAL to content page
    $runValidationModal = Modal_UICreateRunValidation();
    $monitor.appendChild($runValidationModal);

    // add ALERTS MODAL to content page
    $alertsModal = Modal_UICreateAlerts();
    $monitor.appendChild($alertsModal);

    return { $backBtn, $alerts: $alertsModal, $searchEl: $searchElModal, $runAlert: $runValidationModal };
}

// EVENT HANDLERS

function SelectCurrentPage() {
    const btns = Array.from(topbtns);
    const contents = Array.from(contentPages);
    let btn = topbtns.namedItem(`${currentPage}-btn`) as HTMLButtonElement;
    let pageelem = contentPages.namedItem(`${currentPage}-page`) as HTMLDivElement;

    $backBtn.style.display = 'none';
    pageelem.scrollTop = 0;
    selectElemFromGroup(btn, btns);
    selectElemFromGroup(pageelem, contents);
    pageelem.dispatchEvent(new Event('reset'));

    //console.log(`Current Page: ${currentPage}`);
    // if currentPage is home, hide #top-menu
    if (currentPage === monitorNav.home) {
        document.getElementById('top-menu').style.display = 'none';
    } else {
        document.getElementById('top-menu').style.display = 'block';
    }
}

// FUNCTIONS FOR UI SETUP

function UIHomeSetUp() {
    const $homepage = contentPages.namedItem(monitorNav.home + '-page') as HTMLDivElement;

    if ($homepage) {
        UICreateHomePage($homepage);
    }
}

/** For setting up QC Tables, called when sheetdata loaded */
function UIQCTableSetUp(hemeSamples: HemeSampleItem[]) {

    const $qccontentpage = contentPages.namedItem(monitorNav.qcfiles + '-page') as HTMLDivElement;
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
function UIExplorerSetUp(hemeSamples: HemeSampleItem[]) {
    const $explorerpage = contentPages.namedItem(monitorNav.explorer + '-page') as HTMLDivElement;
   
    if ($explorerpage) {
        //UICreateExplorerPage(hemeSamples, $explorerpage);
        new DataExplorer(hemeSamples, $explorerpage);
    }
    
    // also create patient sample page
    UISamplesSetUp(hemeSamples);

    
}

/** For setting up Samples page */
function UISamplesSetUp(hemeSamples: HemeSampleItem[]) {
    const $samplespage = contentPages.namedItem(monitorNav.samples + '-page') as HTMLDivElement;

    if ($samplespage) {
        //filter hemeSamples for non-qc samples
        const samples = hemeSamples
            .filter((sample) => sample.data.groups !== hemeGroups.qc);

        new DataExplorer(samples, $samplespage);

    }
}

/** Sets the currentPage value if in monitorNav 
 * @returns true if value is in monitorNav, false otherwise
 * currentPage listener will call SelectCurrentPage() if true
*/
function SetCurrentPage(value: string): boolean {
    // if value is in monitorNav, set currentPage to value
    if (value in monitorNav) {
        currentPage = value;
        return true;
    } else {
        return false;
    }
}

export { UIMonitorSetUp, UIQCTableSetUp, UIExplorerSetUp, $backBtn, $alertsModal, $runValidationModal, SetCurrentPage, currentPage };