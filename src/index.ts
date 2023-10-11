import './scss/styles.scss';
import { GetData } from './Data/GetGSheetsData';
import { CreateHemeSamplesFromRowData } from './Data/ParseRowsToHemeSample';
import { UIMainSetUp } from './UI/UIMain';
import { UIMonitorSetUp, UIQCTableSetUp, UIExplorerSetUp } from './UI/UIMonitor';
import { Tooltip } from 'bootstrap';

function Load() {
    // set up DOM elements first
    UIMainSetUp("main", "monitor");
    UIMonitorSetUp("monitor");

    // wait for data, then populate UT content from data
    GetData().then((data) => {
        const hemeSamples = CreateHemeSamplesFromRowData(data);
        UIQCTableSetUp(hemeSamples);   
        UIExplorerSetUp(hemeSamples);
    });

    // add tooltip
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl);
    })
  
}

Load();