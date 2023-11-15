import { LineGraph, IChartData } from "../Graph/UICreateLineGraph";
import { QCSampleItem } from "../Data/HemeSampleItem";
import { $backBtn } from "./UIMonitor";

const qcfilespagehtml = require('./UIMonitorQCFiles.html').default;
const maxRows = 1000;

let $graphscontainer: HTMLElement = null;
let $table: HTMLTableElement = null;
let DataItems: QCSampleItem[] = [];

/** Creates table body from data, where Groups="QCSample" = <tr>
 * Expected table for QC Files from `UIMonitorQCFiles.html`:
 * <table>
      <thead>
        <tr>
        <th title="Out of range status">&#9888</th>
        <th>File</th>
        <th>Lot #</th>
        <th>Material</th>
        <th>Expiry Date</th>
        <th>Analysis Date</th>
        </tr>
      </thead>
    </table>
*/
function UICreateQCTable(sampleData: QCSampleItem[], $qcfilesPage: HTMLDivElement) {

    const $tbody = document.createElement('tbody');

    // subpage elements for qcfiles page
    $qcfilesPage.innerHTML = qcfilespagehtml;
    $graphscontainer = $qcfilesPage.querySelector('#graphscontainer') as HTMLElement;
    $table = $qcfilesPage.querySelector('#qcfiletable') as HTMLTableElement;
    $table.appendChild($tbody);

    sampleData.forEach((item, i) => {
        let tr = UI_CreateTableRow(item, i);
        $tbody.appendChild(tr);
    });
    // create remaining empty rows
    for (let i = sampleData.length; i < maxRows; i++) {
        let tr = document.createElement('tr');
        tr.classList.add('_emptyrow');
        $tbody.appendChild(tr);
        let td0 = document.createElement('td'); // Error warning
        td0.innerHTML = '';
        tr.appendChild(td0);
        let td1 = document.createElement('td'); // File
        td1.innerText = "QC" + (i + 1).toString().padStart(maxRows.toString().length, '0');
        tr.appendChild(td1);
        let td2 = document.createElement('td'); // Lot #
        td2.innerText = "";
        tr.appendChild(td2);
        let td3 = document.createElement('td'); // Material
        td3.innerText = "";
        tr.appendChild(td3);
        let td4 = document.createElement('td'); // Expiry Date
        td4.innerText = "";
        tr.appendChild(td4);
        let td5 = document.createElement('td'); // Analysis Date
        td5.innerText = "";
        tr.appendChild(td5);
    }

    // custom event to listen for $qcfilespage reset
    $qcfilesPage.addEventListener('reset', () => {
        resetPage();
    });

    DataItems = sampleData;
}

/** Create table row from item */
function UI_CreateTableRow(item: QCSampleItem, i: number): HTMLTableRowElement {
    let tr = document.createElement('tr');
    let td0text_status = item.data.status != 'OK' ? '&#9888;' : '';
    let td1text_fileNo = getTextFileNo(i);
    let td2text_lotNo = item.lotNo;
    let td3text_material = item.material; //console.log(item);
    let td4text_expiry = item.expiry;
    let td5text_analysisdate = item.analysisDate;
    let td0 = document.createElement('td'); // Error warning
    td0.innerHTML = td0text_status;
    tr.appendChild(td0);
    let td1 = document.createElement('td'); // File
    td1.innerText = td1text_fileNo;
    tr.appendChild(td1);
    let td2 = document.createElement('td'); // Lot #
    td2.innerText = td2text_lotNo;
    tr.appendChild(td2);
    let td3 = document.createElement('td'); // Material
    td3.innerText = td3text_material;
    tr.appendChild(td3);
    let td4 = document.createElement('td'); // Expiry Date
    td4.innerText = td4text_expiry;
    tr.appendChild(td4);
    let td5 = document.createElement('td'); // Analysis Date
    td5.innerText = td5text_analysisdate;
    tr.appendChild(td5);

    // add click event to each row
    tr.addEventListener('click', function () {
        trClickHandler(item, td1text_fileNo);
    });
    return tr;
}

/** creates charts from item's subgroup `haparameter` */
function UILoadQCGraphs(sampleDatum: QCSampleItem, fileno: string) {
    // clear graphs container
    $graphscontainer.innerHTML = '';

    // create header row container div class rowheader for fileInfo
    const fileInfo = {
        'File No.': fileno,
        'Lot No.': sampleDatum.lotNo,
        'Material': sampleDatum.material,
        'Expiry Date': sampleDatum.expiry
    };
    const $fileInfoContainer = document.createElement('div');
    $fileInfoContainer.setAttribute('class', 'rowheader');
    $graphscontainer?.appendChild($fileInfoContainer);
    for (const key in fileInfo) {
        const $div = document.createElement('div');
        $div.setAttribute('class', 'rowheaderitem');
        $div.innerText = `${key}: ${fileInfo[key as keyof typeof fileInfo]}`;
        $fileInfoContainer.appendChild($div);
    }

    // create heading row for graph
    const headingRow = new LineGraph({
        canvasId: 'headingRow',
        xData: [],
        yData: [],
        yTitle: 'Item',
        yMin: 0,
        yMax: 1,
        sd: "sd",
        mean: "mean",
        cv: "cv"
    }, $graphscontainer);

    const analysisdates = sampleDatum.analysisDates;
    const paramerterData = sampleDatum.GetItemsOfSubgroup('haparameter'); //console.log(paramerterData);

    // for each parameterData, create new LineGraph
    for (let key in paramerterData) {

        const paramItem = paramerterData[key];
        const id = paramItem['item'].scrub();
        let yData = analysisdates.map((s, i) => {
            const dateref = 'date' + (i + 1);
            let data = paramItem[dateref];

            if (Number(data)) {
                return Number(data);
            } else if (sampleDatum.presenting) {
                const presenting = sampleDatum.presenting as string;
                const latest = sampleDatum.analysisDate;
                if (presenting == latest) {
                    data = paramItem['presenting'];
                    return Number(data);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        });
        let yTitle = paramItem['label'] ? paramItem['label'] : paramItem['item'];
        let yMin = Number(paramItem['allowedmin']);
        let yMax = Number(paramItem['allowedmax']);
        let sd = Number(paramItem['sd']);
        let mean = Number(paramItem['mean']);
        let cv = Number(paramItem['cv']);
        let chartData: IChartData = {
            canvasId: id,
            xData: analysisdates,
            yData: yData,
            yTitle: yTitle,
            yMin: yMin,
            yMax: yMax,
            sd: sd,
            mean: mean,
            cv: cv
        };
        let chart = new LineGraph(chartData, $graphscontainer);

        // set heading row width to max chart width
        if (yData.length > chart._maxPointsPerPg) {
            headingRow.canvas.style.width = (chart.canvas.width + 100) + 'px';
            headingRow.canvas.parentElement.scrollLeft = headingRow.canvas.parentElement.scrollWidth;
        };

    }

}

/** returns string of the assigned qc file number */
function getTextFileNo(i:number): string {
    return "QC" + (i + 1).toString().padStart(maxRows.toString().length, '0');

}

// EVENT HANDLERS

/** <tr> click handler when item row is clicked*/
function trClickHandler(item: QCSampleItem, fileno: string) {
    $table.style.display = 'none'; // hide table
    $backBtn.style.display = 'inline-block'; // show back            
    UILoadQCGraphs(item, fileno); // create graphs container
}

/** handle qcpage reset */
function resetPage() {
    $table.style.display = 'table'; // show table
    $graphscontainer.innerHTML = ''; // clear graphs container
    $backBtn.style.display = 'none'; // hide back
}

/** TODO update table with Presenting data */
function UI_AddDataRow(id: string) {

    // get the first '_emptyrow' element from table
    const $emptyrow = $table.querySelector('._emptyrow') as HTMLTableRowElement;
    // find id in DataItems
    const item = DataItems.find(item => item.id === id);

    console.log(item);

    // if item is found, update $emptyrow with presenting data
    if (item) {
        // add new row to QC table if item.analysisDate != item.presenting
        if (item.analysisDate != item.presenting) {
            // update item
            item.addPresentingAsNewRun();

            $emptyrow.classList.remove('_emptyrow');
            $emptyrow.cells[0].innerHTML = item.data.status != 'OK' ? '&#9888;' : '';
            $emptyrow.cells[2].innerHTML = item.lotNo;
            $emptyrow.cells[3].innerHTML = item.material;
            $emptyrow.cells[4].innerHTML = item.expiry;
            $emptyrow.cells[5].innerHTML = item.presenting;

            // add click event to each row
            let td1text_fileNo = $emptyrow.cells[1].innerText;
            $emptyrow.addEventListener('click', function () {
                trClickHandler(item, td1text_fileNo);
            });
        }
    }

}
export { UICreateQCTable, UI_AddDataRow as QC_AddDataRow }