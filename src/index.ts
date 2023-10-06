import './scss/styles.scss';
import { GetData } from './Data/GetGSheetsData';
import { UIQCSetUp, ShowHome } from './UI/UIMonitorSetUp';
import { CreateHemeSamplesFromRowData } from './Data/ParseRowsToHemeSample';
import { btnGroupSelHandler } from './helpers/btnGroupSelHandler';

import { Tooltip } from 'bootstrap';

function Load() {
    GetData().then((data) => {
        const hemeSamples = CreateHemeSamplesFromRowData(data); 
        const $monitor = document.getElementById('monitor') as HTMLDivElement;
        const $maincontainer = document.getElementById('maincontainer') as HTMLDivElement;

        const $computerBtn = document.getElementById('computer-btn') as HTMLButtonElement;
        const $runbatchBtn = document.getElementById('runbatch-btn') as HTMLButtonElement;
        const $runmanualBtn = document.getElementById('runmanual-btn') as HTMLButtonElement;
        const $runqcBtn = document.getElementById('runqc-btn') as HTMLButtonElement;
        const btngroup = [$computerBtn, $runbatchBtn, $runmanualBtn, $runqcBtn];

        $monitor.style.display = 'none';
        // set up UI tables
        UIQCSetUp(hemeSamples);

        $computerBtn.addEventListener('click', (e) => {
            $maincontainer.classList.add('mini');
            $monitor.style.display = 'block';
            btnGroupSelHandler(e.currentTarget as HTMLElement, btngroup);
            ShowHome();
        });

        $runbatchBtn.addEventListener('click', (e) => {
            $maincontainer.classList.remove('mini');
            $monitor.style.display = 'none';
            btnGroupSelHandler(e.currentTarget as HTMLElement, btngroup);
        });

        $runmanualBtn.addEventListener('click', (e) => {
            $maincontainer.classList.remove('mini');
            $monitor.style.display = 'none';
            btnGroupSelHandler(e.currentTarget as HTMLElement, btngroup);
        });

        $runqcBtn.addEventListener('click', (e) => {
            $maincontainer.classList.remove('mini');
            $monitor.style.display = 'none';
            btnGroupSelHandler(e.currentTarget as HTMLElement, btngroup);
        });

        // add tooltip
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl);
        })
    });
}

Load();