import { SetCurrentPage } from "./UIMonitor";
import { HideMonitor } from "./UIMain";

const homehtml = require('./UIMonitorHome.html').default;

/** Sets up monitor home navigation 
 * @param $container container div for monitor home page
 * 
 * Icon buttons in the home page are set up to navigate to other pages in the monitor
 * except shut down button which exits the monitor
*/
export function UICreateHomePage($container: HTMLDivElement) {
    $container.innerHTML = homehtml;

    // get the buttons in the home page with data-target attribute
    const $homeBtns = $container.querySelectorAll('[data-target]') as NodeListOf<HTMLButtonElement>;

    // add event listener to each button: set currentPage to the data-target value
    $homeBtns.forEach($btn => {
        // add tooltip to button
        $btn.setAttribute('data-bs-toggle', 'tooltip');

        // event listener    
        $btn.addEventListener('click', () => {
            let target = $btn.dataset.target;

            if (target === 'main') {
                // shut down monitor
                HideMonitor();
            } else {
                let isMonPg = SetCurrentPage(target);

                if (!isMonPg) {
                    // handle other buttons
                }
            }

        });
    });

    // disable all buttons that don't have data-target attribute
    const $disabledBtns = $container.querySelectorAll('button:not([data-target])') as NodeListOf<HTMLButtonElement>;
    $disabledBtns.forEach($btn => {
        $btn.disabled = true;
        $btn.setAttribute('title', 'Not available');
        $btn.setAttribute('data-bs-toggle', 'tooltip');
    });

}