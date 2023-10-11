import { selectElemFromGroup } from '../helpers/selectElemHelper';

const mainhtml = require('./UIMain.html').default;

export function UIMainSetUp(mianID: string, monitorID: string) {
    // load ./UI/main.html file into index.html using html-loader
    const $main = document.getElementById(mianID) as HTMLDivElement;
    $main.innerHTML = mainhtml;
    const $monitor = document.getElementById(monitorID) as HTMLDivElement;

    // get elements from main.html
    const $computerBtn = $main.querySelector('#computer-btn') as HTMLButtonElement;
    const $runbatchBtn = $main.querySelector('#runbatch-btn') as HTMLButtonElement;
    const $runmanualBtn = $main.querySelector('#runmanual-btn') as HTMLButtonElement;
    const $runqcBtn = $main.querySelector('#runqc-btn') as HTMLButtonElement;

    const btngroup = [$computerBtn, $runbatchBtn, $runmanualBtn, $runqcBtn];

    $computerBtn?.addEventListener('click', (e) => {
        $main.classList.add('mini');
        $monitor.classList.add('show');
        selectElemFromGroup(e.currentTarget as HTMLElement, btngroup);
    });

    $runbatchBtn.addEventListener('click', (e) => {
        $main.classList.remove('mini');
        $monitor.classList.remove('show');
        selectElemFromGroup(e.currentTarget as HTMLElement, btngroup);
    });

    $runmanualBtn.addEventListener('click', (e) => {
        $main.classList.remove('mini');
        $monitor.classList.remove('show');
        selectElemFromGroup(e.currentTarget as HTMLElement, btngroup);
    });

    $runqcBtn.addEventListener('click', (e) => {
        $main.classList.remove('mini');
        $monitor.classList.remove('show');
        selectElemFromGroup(e.currentTarget as HTMLElement, btngroup);
    });
}
