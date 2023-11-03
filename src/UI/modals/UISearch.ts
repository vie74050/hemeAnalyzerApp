import { UICreateElemFromString } from '../../helpers/domElemHelper';

/** Creates the search modal element from html template
 * @param $tablecontainer the container element to search attributes for
 * @returns 
 */
function Modal_UICreateSearch($tablecontainer: HTMLElement, attributes): HTMLElement {
    const searchhtml = require('./UISearch.html').default;
    const $searchEl = UICreateElemFromString(searchhtml, 'div') as HTMLElement;
    const $input = $searchEl.querySelector('input') as HTMLInputElement;
    const $submit_btn = $searchEl.querySelector('button[type="submit"]');
    const $reset_btn = $searchEl.querySelector('button[type="reset"]');

    if ($submit_btn) {
        // add event listener to $submit_btn
        $submit_btn.addEventListener('click', (e) => {
            e.preventDefault();
            SearchBtnHandler($input.value.scrub(), $tablecontainer, attributes);
        });
    }

    if ($reset_btn) {
        // add event listener to $submit_btn
        $reset_btn.addEventListener('click', (e) => {
            e.preventDefault();
            $input.value = '';
            SearchBtnHandler('', $tablecontainer, attributes);
        });
    }
   
    return $searchEl;
}

function SearchBtnHandler(str: string, $tbl_container: HTMLElement, attr) {
    const $trs = Array.from($tbl_container.querySelectorAll('tbody tr'));

    $trs.forEach($tr => {
        $tr.classList.remove('hilight'); 
    });   

    // loop through attr and find elems
    if (str.length < 1) return;
    for (const key in attr) {
        // get all tbody tr in $tbl_container
        
        const $elems =  Array.from($tbl_container.querySelectorAll(`[data-${key}*="${str}"]`));
        $elems.forEach($elem => {
            $elem.closest('tr').classList.add('hilight');
        });
    }

}

export { Modal_UICreateSearch };