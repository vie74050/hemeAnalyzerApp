import { UICreateElemFromString } from '../../helpers/domElemHelper';

/** Creates the search modal element from html template
 * @param $tablecontainer the container element to search attributes for
 * @param attributes the HTML attributes to search within the container
 * @returns 
 */
function Modal_UICreateSearch(attributes): HTMLElement {
    const searchhtml = require('./UISearch.html').default;
    const $searchEl = UICreateElemFromString(searchhtml, 'div') as HTMLElement;
    const $input = $searchEl.querySelector('input') as HTMLInputElement;
    const $submit_btn = $searchEl.querySelector('button[type="submit"]');
    const $reset_btn = $searchEl.querySelector('button[type="reset"]');

    if ($submit_btn) {
        // add event listener to $submit_btn
        $submit_btn.addEventListener('click', (e) => {
            e.preventDefault();
            SearchBtnHandler($input.value.scrub(), attributes);
        });
    }

    if ($reset_btn) {
        // add event listener to $submit_btn
        $reset_btn.addEventListener('click', (e) => {
            e.preventDefault();
            $input.value = '';
            SearchBtnHandler('', attributes);
        });
    }
   
    return $searchEl;
}

function SearchBtnHandler(str: string, attributes) {
    // .tablecontainer of .content-page.selected
    const $tbl_container: HTMLElement = document.querySelector('.content-page.selected .tablecontainer');


    const $trs = Array.from($tbl_container.querySelectorAll('tbody tr'));

    $trs.forEach($tr => {
        $tr.classList.remove('hilight'); 
    });   

    // loop through attr and find elems
    if (str.length < 1) return;
    for (const key in attributes) {
        // get all tbody tr in $tbl_container
        
        const $elems =  Array.from($tbl_container.querySelectorAll(`[data-${key}*="${str}"]`));
        $elems.forEach($elem => {
            $elem.closest('tr').classList.add('hilight');
        });
    }

}

export { Modal_UICreateSearch };