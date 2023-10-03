import { hemeGroups, CreateHemeSamplesFromRowData } from "../Data/ParseRowsToHemeSample";
import { GetData } from "../Data/GetGSheetsData";
import { QCSampleItem } from "../Data/HemeSampleItem";
import { UICreateQCTable } from "./UICreateQCTable";

// specify dom elements
const $qctable = document.getElementById('qcfiletable') as HTMLTableElement;
const $qcfilesBtn = document.getElementById('QCFiles-btn') as HTMLButtonElement;
export const $backBtn = document.getElementById('back-btn') as HTMLButtonElement;
export const $graphscontainer = document.getElementById('graphscontainer');

// UI event handlers
$qcfilesBtn.addEventListener('click', () => {
    ShowQCFilesTable();
});
$backBtn.addEventListener('click', () => {
    ShowQCFilesTable();
});

function ShowQCFilesTable() {
    $qctable.style.display = 'table';
    $qcfilesBtn.classList.add('selected');
    // hide back button
    $backBtn.style.display = 'none';
    // clear graphs container
    $graphscontainer.innerHTML = '';
}

function UISetUp() {
    let data = GetData();
    data.then((data) => {
        const hemeSamples = CreateHemeSamplesFromRowData(data); 
        
        // create QC table
        if ($qctable) {
            // filter hemeSamples for QC Samples
            const qcsamples = hemeSamples
                            .filter((sample) => sample.data.groups === hemeGroups.qc)
                            .map((sample) => sample as QCSampleItem);

            UICreateQCTable(qcsamples, $qctable);

        }
    });    
}

UISetUp();