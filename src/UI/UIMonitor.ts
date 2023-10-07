import { hemeGroups } from "../Data/ParseRowsToHemeSample";
import { HemeSampleItem, QCSampleItem } from "../Data/HemeSampleItem";
import { UICreateQCTable } from "./UIMonitorQCFiles";
import { btnGroupSelHandler } from "../helpers/btnGroupSelHandler";

enum monitorNav {
    home = 'home',
    qcfiles = 'qcfiles',
    explorer = 'explorer',
    back = 'back'
}
let monitorNavBtns: HTMLButtonElement[],
    $backBtn: HTMLButtonElement,
    $qctable: HTMLTableElement, 
    $graphscontainer: HTMLElement,
    currentPage: string = monitorNav.home;

function UIMonitorSetUp(monitorId: string) {
    const monitorhtml = require('./UIMonitor.html').default;
    const $monitor = document.getElementById(monitorId) as HTMLDivElement;
    $monitor.innerHTML = monitorhtml;

    // specify dom elements
    $graphscontainer = $monitor.querySelector('#graphscontainer') as HTMLElement;
    $qctable = $monitor.querySelector('#qcfiletable') as HTMLTableElement;

    // loop through monitorNav enum and get buttons from #top-menu
    let pagesNav = [];
    monitorNavBtns = [];
    for (let btn in monitorNav) {
        let btnelem = $monitor.querySelector(`#${btn}-btn`) as HTMLButtonElement;
        let pageelem = $monitor.querySelector(`#${btn}-page`) as HTMLDivElement;
        
        if (pageelem) {
            pagesNav.push(pageelem);
            // initially hide all pages except home
            if (btn == 'home') {
                btnGroupSelHandler(pageelem, pagesNav);
            }  
        }             
                
        // add event for button if it exists
        if (btnelem) {
            monitorNavBtns.push(btnelem);
            if (btn == 'back') {
                $backBtn = btnelem;
                btnelem.addEventListener('click', () => {
                    $backBtn.style.display = 'none';

                    switch (currentPage) {
                        case monitorNav.qcfiles:
                            ShowQCFilesTable();
                            break;
                        default:
                            break;
                    }
                    
                });

            } else {
                if (btn == 'home') {
                    btnGroupSelHandler(btnelem, monitorNavBtns);
                }
                btnelem.addEventListener('click', () => {
                    btnGroupSelHandler(btnelem, monitorNavBtns);
                    currentPage = btn;
                    if (pageelem){
                        btnGroupSelHandler(pageelem, pagesNav);
                    }
                    switch (currentPage) {
                        case monitorNav.qcfiles:
                            ShowQCFilesTable();
                            break;
                        default:
                            break;
                    }
                    
                });

            }
            
        }
    }
    
    return { $qctable, $backBtn, $graphscontainer, monitorNavBtns };
}

function ShowQCFilesTable() {
    
    $qctable.style.display = 'table';
    // clear graphs container
    $graphscontainer.innerHTML = '';

    btnGroupSelHandler(monitorNavBtns[1], monitorNavBtns);
}

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

export {UIMonitorSetUp, UIQCTableSetUp, $graphscontainer, $backBtn };