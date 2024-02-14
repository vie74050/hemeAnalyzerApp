const bottomhtml = require('./UIMonitorBottom.html').default;

enum Machinestatus {
    idle = 'idle',
    running = 'running',
    warning = 'warning',
    error = 'error'
}
enum Rackopts { '_1', '_2', '_3', '_4' };
enum Rackpos { '_1', '_2', '_3', '_4', '_5' };

function UIBottomSetup($bot: HTMLElement) {
    $bot.innerHTML = bottomhtml;
    
    UISetupRack();
    
    // UI EVENTS
    /*const $runBtn = $bot.querySelector('#run-mode');
    $runBtn?.addEventListener('click', () => {
        SetMachineStatus(Machinestatus.warning);
        AnimateRackPositions();
    });*/
}

function UISetupRack() {
    const racttxt = "➊➋➌➍➎";
    const $rackcontainer = document.getElementById('rack-status');
    const $rack = $rackcontainer.getElementsByClassName('rack');
 
    // loop through racks
    for (let i = 0; i < $rack.length; i++) {
        let settingtxt = "";
        // loop through racttxt positions and add to settingtxt
        for (let j = 0; j < racttxt.length; j++) {
            settingtxt += `<span>${racttxt[j]}</span>`;
        }
        $rack[i].innerHTML = settingtxt;
    }
}

/** Sets the style for #machine-status */
function SetMachineStatus(s: Machinestatus) {
    const $status = document.getElementById('machine-status');
    $status.className = s;
}

/** Sets the display and label for #rack-status elements */
function SetRackPosition(rack: number, pos: number) {
    const racttxt = "➊➋➌➍➎";
    const $rackcontainer = document.getElementById('rack-status');
    const $rack = $rackcontainer.getElementsByClassName('rack')[rack];
    const $label = $rackcontainer.getElementsByClassName('label')[0];
    const $active = $rackcontainer.getElementsByClassName('active');
    
    // remove all active class under $rackcontainer
    for (let i = 0; i < $active.length; i++) {
        $active[i].className = '';
    }

    if ($rack === undefined) {
        //console.log(`rack ${rack} not found`);
        return;
    }
    if ($label === undefined) {
        //console.log(`label not found`);
        return;
    }
        
    // loop through racttxt positions and set class
    for (let i = 0; i < racttxt.length; i++) {
        if (i === pos) {
            $rack.children[i].className = 'active';
        } else {
            $rack.children[i].className = '';
        }
    }

    $label.innerHTML = `${rack+1} - ${pos+1}`;

}

/** animate through set rack positions */
function AnimateRackPositions(t: number = 1000) {
    let rack = 0;
    let pos = 0;
    let interval = setInterval(() => {
        SetRackPosition(rack, pos);
        pos++;

        if (pos > Rackpos._5) {
            pos = 0;
            rack++;
            if (rack > Rackopts._4+1) {
                
                // clear interval
                clearInterval(interval);
            }
        }
    }, t);
}

/** Sets the text for #sample-info */
function SetSampleInfo(s: string) {
    document.getElementById('sample-info').innerHTML = s;
}

export { UIBottomSetup, SetMachineStatus, SetRackPosition, SetSampleInfo }