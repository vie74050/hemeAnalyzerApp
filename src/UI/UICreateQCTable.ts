import { LineGraph, IChartData } from "../Graph/UICreateLineGraph";
import { QCSampleItem } from "../Data/HemeSampleItem";
import { $graphscontainer } from "./UISetUp";
import { $backBtn } from "./UISetUp";

/** Populates table body from data, where Groups="QCSample" = <tr>
 * Expected table for QC Files:
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
export function UICreateQCTable(sampleData: QCSampleItem[], table: HTMLTableElement) {
    const maxRows = 1000;
    const $tbody = document.createElement('tbody');
    table.appendChild($tbody);

    sampleData.forEach((item, i) => {
        let tr = document.createElement('tr');
        let td0text_status = item.data.status != 'OK' ? '&#9888;' : '';
        let td1text_fileNo = "QC" + (i + 1).toString().padStart(maxRows.toString().length, '0');
        let td2text_lotNo = item.lotNo;
        let td3text_material = item.material; //console.log(item);
        let td4text_expiry = item.expiry;
        let td5text_analysisdate = item.analysisDate;

        item.setQCFileNo(td1text_fileNo); // set qc file no. assigned to sample 
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
        $tbody.appendChild(tr);

        // add click event to each row
        tr.addEventListener('click', function () {

            table.style.display = 'none'; // hide table
            $backBtn.style.display = 'inline-block'; // show back            
            UILoadQCGraphs(item); // create graphs container

        });
    });
    // create remaining empty rows
    for (let i = sampleData.length; i < maxRows; i++) {
        let tr = document.createElement('tr');
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

}

/** Creates charts from sampleData subgroup `haparameter` */
export function UILoadQCGraphs(sampleData: QCSampleItem) {
    // clear graphs container
    $graphscontainer.innerHTML = '';

    // create header row container div class graphrowheader for fileInfo
    const fileInfo = {
        'File No.': sampleData.id,
        'Lot No.': sampleData.lotNo,
        'Material': sampleData.material,
        'Expiry Date': sampleData.expiry
    };
    const $fileInfoContainer = document.createElement('div');
    $fileInfoContainer.setAttribute('class', 'graphrowheader');
    $graphscontainer?.appendChild($fileInfoContainer);
    for (const key in fileInfo) {
        const $div = document.createElement('div');
        $div.setAttribute('class', 'graphrowheaderitem');
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
    });
    $graphscontainer?.appendChild(headingRow.CreateGraphHeader());

    const analysisdates = sampleData.analysisDates;
    const paramerterData = sampleData.GetSubgroup('haparameter'); //console.log(paramerterData);

    // for each parameterData, create new LineGraph
    for (let key in paramerterData) {

        const paramItem = paramerterData[key];
        const id = paramItem['item'].scrub();
        const yData = analysisdates.map((s, i) => {
            let dateHeader = 'date' + (i + 1);
            return Number(paramItem[dateHeader]);
        });
        const yTitle = paramItem['label'] ? paramItem['label'] : paramItem['item'];
        const yMin = Number(paramItem['allowedmin']);
        const yMax = Number(paramItem['allowedmax']);
        const sd = Number(paramItem['sd']);
        const mean = Number(paramItem['mean']);
        const cv = Number(paramItem['cv']);
        const chartData: IChartData = {
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
        const chart = new LineGraph(chartData);
        $graphscontainer?.appendChild(chart.CreateGraphRow());
    }

}

