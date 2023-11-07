import { selectElemFromGroup } from '../helpers/domElemHelper';
import { QC_AddDataRow } from './UIMonitorQCFiles';
import { Explorer_AddDataRow } from './UIMonitorExplorer';
import { HemeSampleItem, QCSampleItem } from '../Data/HemeSampleItem';
import { hemeGroups } from '../Data/ParseRowsToHemeSample';

const mainhtml = require('./UIMain.html').default;
let $main: HTMLDivElement, $monitor: HTMLDivElement;

/** Setup HTML */
function UIMainSetUp(mainID: string, monitorID: string) {
    $main = document.getElementById(mainID) as HTMLDivElement;
    $main.innerHTML = mainhtml;
    $monitor = document.getElementById(monitorID) as HTMLDivElement;
}

/** set up UI events after data loaded */
function UIEventsSetUp(hemeSampleItems: HemeSampleItem[]) {
    // get elements from main.html
    const $computerBtn = $main.querySelector('#computer-btn') as HTMLButtonElement;
    const $mainBtn = $main.querySelector('#main-btn') as HTMLButtonElement;
    let btngroup = [$computerBtn];

    $computerBtn?.addEventListener('click', (e) => {
        $main.classList.add('mini');
        $monitor.classList.add('show');
        selectElemFromGroup(e.currentTarget as HTMLElement, btngroup);
    });
    $mainBtn?.addEventListener('click', (e) => {
        $main.classList.remove('mini');
        $monitor.classList.remove('show');
    });

    // sample items associated w each type of heme sample
    let samples: { [key: string]: string[] } = {};
    for (let key in hemeGroups) {
        // filter for hemeGroup items that have presenting data only
        samples[key] = hemeSampleItems.filter((item) => {

            return item.group.scrub() === hemeGroups[key].scrub() && item.hasPresenting();
        }).map((item) => {
            return item.id;
        });

        const $btn = $main.querySelector('#run' + key + '-btn') as HTMLButtonElement;
        if (samples[key].length === 0) {
            // remove the button if no sample items
            $btn.remove();
        } else {
            btngroup.push($btn);
            $btn.addEventListener('click', (e) => {
                selectElemFromGroup(e.currentTarget as HTMLElement, btngroup);

                if ($btn.classList.contains('disabled')) {
                    return;
                }

                ShowModal($btn, samples[key]);

            });
        }
    }
}

function ShowModal($btn: HTMLButtonElement, samples: string[]) {


    UI_RunHandler(samples, $btn);
}

function UI_RunHandler(ids: string[], $btn: HTMLButtonElement) {
    const tooltiphtml = require('./UIMain_tooltip.html').default;
    const btnid = $btn.id;
    let attrhtml = '', option = '';
    enum styleoption {
        // options for testube styles
        'qc0' = '',
        'qc1' = 'white',
        'qc2' = 'grey',
        'small' = 'small'
    };

    for (let i = 0; i < ids.length; i++) {
        // randomly generate barcode image
        let barcode = '';

        for (let i = 0; i < 10; i++) {
            let randomly = Math.floor(Math.random() * 100);
            barcode += randomly > 55 ? "║" : randomly > 25 ? "│" : "|";

        }

        if (btnid === 'runqc-btn') {// qc samples testtube styles      
            option = styleoption['qc' + i];
        }

        // change the tooltip content
        let label = ids[i].toUpperCase().padEnd(15, ' ');
        attrhtml += tooltiphtml.replace('{{id}}', label)
            .replace('{{optional}}', option)
            .replace('{{barcode}}', barcode);

        // update content
        QC_AddDataRow(ids[i]);
        Explorer_AddDataRow(ids[i]);
    }

    /** @TODO update data-bs-original-title attribut to show selected sample ids */
    $btn.setAttribute('data-bs-original-title', attrhtml);
    $btn.classList.add('disabled');
}

export { UIMainSetUp, UIEventsSetUp as UIMainEventsSetUp };