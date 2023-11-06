import { SetCurrentPage } from "./UIMonitor";
const homehtml = require('./UIMonitorHome.html').default;

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
            SetCurrentPage($btn.dataset.target);
        });
    });

    // disable all buttons that don't have data-target attribute
    const $disabledBtns = $container.querySelectorAll('button:not([data-target])') as NodeListOf<HTMLButtonElement>;
    $disabledBtns.forEach($btn =>{
        $btn.disabled = true;
        $btn.setAttribute('title', 'Not available');
        $btn.setAttribute('data-bs-toggle', 'tooltip');
    });

}