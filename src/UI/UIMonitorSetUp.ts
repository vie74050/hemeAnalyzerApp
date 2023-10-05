import { hemeGroups } from "../Data/ParseRowsToHemeSample";
import { HemeSampleItem, QCSampleItem } from "../Data/HemeSampleItem";
import { UICreateQCTable } from "./UICreateQCTable";
import { btnGroupSelHandler } from "../helpers/btnGroupSelHandler";

// specify dom elements
export const $backBtn = document.getElementById('back-btn') as HTMLButtonElement;
export const $graphscontainer = document.getElementById('graphscontainer');
const $qctable = document.getElementById('qcfiletable') as HTMLTableElement;

// monitor nav buttons
const $qcfilesBtn = document.getElementById('qcfiles-btn') as HTMLButtonElement;
const $homeBtn = document.getElementById('home-btn') as HTMLButtonElement;
const $explorerBtn = document.getElementById('explorer-btn') as HTMLButtonElement;
const monitorNavBtns = [$qcfilesBtn, $homeBtn, $explorerBtn];

// UI event handlers
$qcfilesBtn.addEventListener('click', () => {
    ShowQCFilesTable();
});
$backBtn.addEventListener('click', () => {
    ShowQCFilesTable();
});
$homeBtn.addEventListener('click', (e) => {
    ShowHome();
});
function ShowHome() {
    $qctable.style.display = 'none';
    $backBtn.style.display = 'none';
    $graphscontainer.innerHTML = '';
    btnGroupSelHandler($homeBtn, monitorNavBtns);
}
function ShowQCFilesTable() {
    $qctable.style.display = 'table';
   
    // hide back button
    $backBtn.style.display = 'none';
    // clear graphs container
    $graphscontainer.innerHTML = '';

    btnGroupSelHandler($qcfilesBtn, monitorNavBtns);
}

function UIQCSetUp(hemeSamples: HemeSampleItem[]) {
                
    // create QC table
    if ($qctable) {
        // filter hemeSamples for QC Samples
        const qcsamples = hemeSamples
                        .filter((sample) => sample.data.groups === hemeGroups.qc)
                        .map((sample) => sample as QCSampleItem);

        UICreateQCTable(qcsamples, $qctable);

    }   
}

export { UIQCSetUp, ShowHome };