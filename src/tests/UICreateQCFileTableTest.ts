
import { UICreateQCFileTableDataRows, eventHandlerQCFiles } from "../Tables/UICreateQCFileTable";

const qcfilesBtn = document.getElementById('QCFiles-btn') as HTMLButtonElement;

function UICreateQCFileTableTest(tableId: string) {
    const table = document.getElementById(tableId) as HTMLTableElement;
    UICreateQCFileTableDataRows(table);
    qcfilesBtn.classList.add('selected');
   
};

qcfilesBtn.addEventListener('click', () => {
    eventHandlerQCFiles();
});

UICreateQCFileTableTest('qcfiletable');