import { SetCurrentPage } from "./UIMonitor";
const homehtml = require('./UIMonitorHome.html').default;

export function UICreateHomePage($container: HTMLDivElement) {
    $container.innerHTML = homehtml;

    // get the buttons in the home page with data-target attribute
    const $homeBtns = $container.querySelectorAll('[data-target]') as NodeListOf<HTMLButtonElement>;

    // add event listener to each button: set currentPage to the data-target value
    $homeBtns.forEach($btn => {
        $btn.addEventListener('click', () => {
            // add tooltip to button
            $btn.setAttribute('data-bs-toggle', 'tooltip');
            
            SetCurrentPage($btn.dataset.target);
        });
    });

    // disable all buttons that don't have data-target attribute
    const $disabledBtns = $container.querySelectorAll('button:not([data-target])') as NodeListOf<HTMLButtonElement>;
    $disabledBtns.forEach($btn => $btn.disabled = true);

}