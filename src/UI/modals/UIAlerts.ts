import { UICreateElemFromString } from '../../helpers/domElemHelper';
interface IDetails {
    actions: string;
    errors: string;
}
export function Modal_UICreateAlerts(): HTMLElement {
    const html = require('./UIAlerts.html').default;
    const $elem = UICreateElemFromString(html, 'div') as HTMLElement;
    const $actions_text = $elem.querySelector('#actions-text') as HTMLTextAreaElement;
    const $error_text = $elem.querySelector('#errors-text') as HTMLTextAreaElement;

    $elem.addEventListener('updatemodal', function(e: CustomEvent) {  
        const details: IDetails = e.detail;
        //console.log(details);
        $actions_text.value = details.actions || '';
        $error_text.value = details.errors || '';
    });
    return $elem;
}

