import { QC_AddDataRow } from './UIMonitorQCFiles';
import { Explorer_AddDataRow } from './UIMonitorExplorer';
import { HemeSampleItem } from '../Data/HemeSampleItem';
import { hemeGroups } from '../Data/ParseRowsToHemeSample';
import { Modal_UICreateVideo, IDetails } from './modals/UIVideo';
import { Tooltip } from 'bootstrap';

const mainhtml = require('./UIMain.html').default;
let $main: HTMLDivElement, $monitor: HTMLDivElement;
let $modal: HTMLElement = null;

/** Setup HTML */
function UIMainSetUp(mainID: string, monitorID: string) {
    $main = document.getElementById(mainID) as HTMLDivElement;
    $main.innerHTML = mainhtml;
    $monitor = document.getElementById(monitorID) as HTMLDivElement;
    $modal = Modal_UICreateVideo();
    $main.appendChild($modal);
}

/** set up UI events after data loaded */
function UIEventsSetUp(hemeSampleItems: HemeSampleItem[]) {
    // get elements from main.html
    const $computerBtn = $main.querySelector('#computer-btn') as HTMLButtonElement;
    const $mainBtn = $main.querySelector('#main-btn') as HTMLButtonElement;
    let btngroup = [$computerBtn];

    $computerBtn?.addEventListener('click', (e) => {
        showMonitor();
    });
    $mainBtn?.addEventListener('click', (e) => {
        HideMonitor();
    });

    // sample items associated w each type of heme sample
    var samples: { [key: string]: string[] } = {};
    for (let btnid in hemeGroups) {
        // filter for hemeGroup items that have presenting data only
        samples[btnid] = hemeSampleItems.filter((item) => {

            return item.group.scrub() === hemeGroups[btnid].scrub() && item.hasPresenting();
        }).map((item) => {
            return item.id;
        });

        const $btn = $main.querySelector('#run' + btnid + '-btn') as HTMLButtonElement;
        
        if (samples[btnid].length === 0) {
            // remove the button if no sample items
            $btn.remove();
        } else {
            btngroup.push($btn);
            $btn.addEventListener('click', (e) => {
              
                if ($btn.classList.contains('disabled')) {
                    return;
                }
                ui_RunHandler(samples[btnid], $btn);
                showVideoModal( btnid );

            });
        }

        new Tooltip($btn);
    }
}

// EVENT HANDLERS
function showMonitor() {
    $main.classList.add('mini');
    $monitor.classList.add('show');
}

function HideMonitor() {
    $main.classList.remove('mini');
    $monitor.classList.remove('show');
}

function showVideoModal( key : string) {
    enum srcs {
        qc = 'https://bcit365-my.sharepoint.com/personal/vienna_ly_bcit_ca/_layouts/15/embed.aspx?UniqueId=4c41a444-c24c-4744-b275-e513a87dba45&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create',
        pa = 'https://www.youtube.com/embed/YQhz7jxorMg?si=NOFU9zv8txQAU3Wi&amp;start=43&end=50',
        ma = 'https://www.youtube.com/embed/YQhz7jxorMg?si=NOFU9zv8txQAU3Wi&amp;start=29&end=33&rel=0'
    }
    enum titles {
        qc = 'Running QC Samples',
        pa = 'Running Patient Samples',
        ma = 'Running Manual Sample'
    }
    let detail: IDetails = {
        src: srcs[key],
        title: titles[key]
    };
    $modal.dispatchEvent(new CustomEvent('updatemodal', {detail: detail}));
}

function ui_RunHandler(ids: string[], $btn: HTMLButtonElement) {
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

    $btn.setAttribute('data-bs-original-title', attrhtml);
    $btn.setAttribute('data-bs-toggle', 'tooltip');
    $btn.setAttribute('data-bs-target', '');
    $btn.classList.add('disabled');
    
}

export { UIMainSetUp, UIEventsSetUp as UIMainEventsSetUp, HideMonitor };