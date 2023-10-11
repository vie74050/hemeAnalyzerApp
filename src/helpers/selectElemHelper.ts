/** Adds `selected` class to specified elem from elemgroup
 * Removes from other buttons in btngroup
 * @param $elem - elem to add `selected` class
 * @param elemgroup - array of elms in the group
 */
export function selectElemFromGroup($elem: HTMLElement, elemgroup: HTMLElement[]) {
    elemgroup.forEach((elem) => {
        elem.classList.remove('selected');
    });
    $elem.classList.add('selected');
}
