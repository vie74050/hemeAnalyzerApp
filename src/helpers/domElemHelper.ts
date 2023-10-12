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

/** Creates a DOM element from a string
 * @param htmlstring - html string
 * @param tag - tag of element to return
 */
export function UICreateElemFromString(htmlstring:string, tag: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlstring, 'text/html');

    return doc.body.getElementsByTagName(tag)[0] ;
}