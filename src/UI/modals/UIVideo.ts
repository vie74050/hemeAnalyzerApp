import { UICreateElemFromString } from '../../helpers/domElemHelper';

export interface IDetails {
    src: string; // url of iframe src
    title: string;
}

export function Modal_UICreateVideo(): HTMLElement {
    const html = require('./UIVideo.html').default;
    const $elem = UICreateElemFromString(html, 'div') as HTMLElement;
    const $iframe = $elem.querySelector('iframe') as HTMLIFrameElement;
    const $close = $elem.querySelector('.close') as HTMLElement;

    $elem.addEventListener('updatemodal', function(e: CustomEvent) {  
        const details: IDetails = e.detail;
        const cursrc = $iframe.getAttribute('src');
        
        if (cursrc === details.src) {
            
            return;
        }
        console.log( details.src);
        $iframe.src = details.src;
        
    });

    $close.addEventListener('click', function(e) {
        // stop video in iframe
        $iframe.setAttribute('src', '');
    });

    return $elem;
}

