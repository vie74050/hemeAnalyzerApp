import './scss/styles.scss';
import { GetData } from './Data/GetGSheetsData';
import { CreateHemeSamplesFromRowData } from './Data/ParseRowsToHemeSample';
import { UIMainSetUp } from './UI/UIMain';
import { UIMonitorSetUp } from './UI/UIMonitor';
import { UIQCTableSetUp } from './UI/UIMonitor';
import { Tooltip } from 'bootstrap';

function Load() {
    UIMainSetUp("main", "monitor");
    UIMonitorSetUp("monitor");

    GetData().then((data) => {
        const hemeSamples = CreateHemeSamplesFromRowData(data);
        UIQCTableSetUp(hemeSamples);   
    });

    // add tooltip
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl);
    })
  
}

Load();