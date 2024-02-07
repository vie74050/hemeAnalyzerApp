import { UICreateElemFromString } from '../../helpers/domElemHelper';

export interface IOptions {
    options: string[];
    fb_right: string;
    fb_wrong: string;
}

/** Modal for run Actions and Alerts */
export function Modal_UICreateRunStatus(): HTMLElement {
    const html = require('./UIRunStatus.html').default;
    const $elem = UICreateElemFromString(html, 'div') as HTMLElement;
    const $options = $elem.querySelector('#options-text') as HTMLSelectElement;
  
    $elem.addEventListener('updatemodal', function(e: CustomEvent) {  
        
    });
    return $elem;
}
