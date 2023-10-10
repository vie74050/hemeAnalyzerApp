/** Adds `selected` class to specified $btn from btngroup
 * Removes from other buttons in btngroup
 * @param $btn - elem to add `selected` class
 * @param btngroup - array of elms in the group
 */
export function btnGroupSelHandler($btn: HTMLElement, btngroup: HTMLElement[]) {
    btngroup.forEach((btn) => {
        btn.classList.remove('selected');
    });
    $btn.classList.add('selected');
}
