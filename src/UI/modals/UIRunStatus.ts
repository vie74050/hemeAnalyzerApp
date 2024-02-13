import { UICreateElemFromString } from '../../helpers/domElemHelper';

export interface IDetails {
    correct: string;
    prompt_done?: string;
    prompt_todo?: string;
    options?: string[];
    fb_right?: string;
    fb_wrong?: string;
}

/** Modal for run Actions and Alerts */
export function Modal_UICreateRunStatus(): HTMLElement {
    const html = require('./UIRunStatus.html').default;
    const $elem = UICreateElemFromString(html, 'div') as HTMLElement;
    const $prompt = $elem.querySelector('._select-prompt') as HTMLElement;
    const $options = $elem.querySelectorAll('.form-check') as NodeListOf<HTMLElement>;
    const $optionLabelsArr = Array.from($elem.querySelectorAll('.form-check-label')).map(label => label.innerHTML);
    const $fbtext = $elem.querySelector('._fb-text') as HTMLElement;
    const defaultDetails: IDetails = {
        correct: '',
        prompt_done: 'This run sample has been validated',
        prompt_todo: $prompt.innerHTML,
        options: $optionLabelsArr,
        fb_right: 'Correct!',
        fb_wrong: 'Incorrect, review the data and try again.'
    };
    const $submitbtn = $elem.querySelector('._submit-btn') as HTMLButtonElement;

    let correct_opts: string[] = [];
    
    // EVENT HANDLER for when the modal is updated, e.g. when a new run is selected
    $elem.addEventListener('updatemodal', function(e: CustomEvent) {  
        //console.log(e.detail);
        const details: IDetails = e.detail;
        correct_opts = details.correct.split(',');

        // initially hide the feedback text
        $fbtext.classList.add('d-none');

        if (correct_opts.length === 1) {
            // already validated
            $prompt.innerHTML =  details.prompt_done || defaultDetails.prompt_done;
            // mark each checkbox option as checked and readonly
            $options.forEach(($opt) => {
                const $input = $opt.querySelector('input') as HTMLInputElement;
                $input.checked = true;
                //$input.checked = correct_opts.includes($input.value);
                $input.readOnly = true;
                $input.disabled = true;
            });
            
            // hide the modal-footer
            $elem.querySelector('.modal-footer').classList.add('d-none');
        }else {
            // not validated
            $prompt.innerHTML = details.prompt_todo || defaultDetails.prompt_todo;

            // mark each checkbox option as unchecked and readonly
            $options.forEach(($opt) => {
                const $input = $opt.querySelector('input') as HTMLInputElement;
                $input.checked = false;
                $input.readOnly = false;
                $input.disabled = false;
            });
        
            $elem.querySelector('.modal-footer').classList.remove('d-none');
        }

    });

    // EVENT HANDLER for when the modal is submitted
    $submitbtn.addEventListener('click', function() {
        $fbtext.innerHTML = defaultDetails.fb_right;
        // check user's checked options against correct_opts  
        // add _fb-correct or _fb-wrong class to option
        $options.forEach(($opt) => {
            const $input = $opt.querySelector('input') as HTMLInputElement;
            const $inputchecked = $input.checked;
            const is_correct = (correct_opts.includes($input.value) && $inputchecked) || (!correct_opts.includes($input.value) && !$inputchecked);
            if (is_correct) {
                $opt.classList.add('_fb-correct');
            } else {
                $opt.classList.add('_fb-wrong');
                $fbtext.innerHTML = defaultDetails.fb_wrong;
            }
        });

        // show the feedback text
        $fbtext.classList.remove('d-none');
        
        

    });

    // EVENT HANDLER for when any input is clicked
    $elem.addEventListener('click', function(e: Event) {
        const $target = e.target as HTMLElement;
        if ($target.tagName === 'INPUT') {
            // remove all _fb-correct and _fb-wrong classes from all options
            $options.forEach(($opt) => {
                $opt.classList.remove('_fb-correct', '_fb-wrong');
            });
            // hide the feedback text
            $fbtext.classList.add('d-none');
        }
    });


    return $elem;
}
