import { UICreateElemFromString } from '../../helpers/domElemHelper';
import { HemeSampleItems } from '../..';
import { HemeSampleItem } from '../../Data/HemeSampleItem';
import { RunData } from '../../Data/GetRunData';

interface IDetails {
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
        prompt_done: 'This run sample has been validated.',
        prompt_todo: 'Select which parts of the CBC are acceptable and can be “validated”:',
        options: $optionLabelsArr,
        fb_right: 'Correct!',
        fb_wrong: 'Incorrect, review the data and try again.'
    };
    const $submitbtn = $elem.querySelector('._submit-btn') as HTMLButtonElement;

    let details: IDetails = defaultDetails;
    let validated_data: string = '';
    let correct_opts: string[] = [];
    let isValidated: boolean = false;
    let $samplepg: HTMLElement;
    let hemesample: HemeSampleItem;
    let dateref: string = '';

    // EVENT HANDLER for when the modal is updated
    $elem.addEventListener('updatemodal', function(e: CustomEvent) {  
        if (e.detail) {
            $samplepg = e.detail.$elem;
            hemesample = HemeSampleItems.filter((item) => item.id == e.detail.id)[0]; 
            dateref = e.detail.dateref;

            const runinfo = e.detail.runinfo || {}; 
            // check runinfo for each details parameter - if not found, use default
            details = {
                prompt_done: runinfo['PromptDone'] || defaultDetails.prompt_done,
                prompt_todo: runinfo['PromptTodo'] || defaultDetails.prompt_todo,
                options: runinfo['Options'] || defaultDetails.options,
                fb_right: runinfo['FbRight'] || defaultDetails.fb_right,
                fb_wrong: runinfo['FbWrong'] || defaultDetails.fb_wrong
            };
            
            validated_data = runinfo['Validated'] || '';
            
        }

        correct_opts = validated_data.replace(/ /g,'').toLowerCase().split(',');        
        isValidated = correct_opts[0] === 'v';

        // initially hide the feedback text
        $fbtext.classList.add('d-none');

        // clear all fb classes from options
        $options.forEach(($opt) => {
            $opt.classList.remove('_fb-correct', '_fb-wrong');
        });

        if (isValidated) {
            // already validated
            $prompt.innerHTML =  details.prompt_done;
            // mark each checkbox option as checked and readonly
            $options.forEach(($opt) => {
                const $input = $opt.querySelector('input') as HTMLInputElement;
                
                $input.checked = correct_opts.includes($input.value); 
                $input.readOnly = true;
                $input.disabled = true;
            });
            
            // hide the modal-footer
            $elem.querySelector('.modal-footer').classList.add('d-none');

            // update samplepg
            $samplepg.innerHTML = 'Validated';
            $samplepg.classList.add('selected');

        }else {
            // Set 'not validated' prompt
            $prompt.innerHTML = details.prompt_todo || defaultDetails.prompt_todo;

            // Reset checkboxes: unchecked, not readonly, not disabled
            $options.forEach(($opt) => {
                const $input = $opt.querySelector('input') as HTMLInputElement;
                $input.checked = false;
                $input.readOnly = false;
                $input.disabled = false;
            });
            
            // show footer (submit button)
            $elem.querySelector('.modal-footer').classList.remove('d-none');

            // update samplepg
            $samplepg.innerHTML = 'Not Validated';
            $samplepg.classList.remove('selected');
        }

    });

    // EVENT HANDLER for when the modal is submitted
    $submitbtn.addEventListener('click', function() {
        $fbtext.innerHTML = defaultDetails.fb_right;
        $fbtext.classList.remove('d-none');

        // check user's checked options against correct_opts  
        // add _fb-correct or _fb-wrong class to option
        $options.forEach(($opt) => {
            const $input = $opt.querySelector('input') as HTMLInputElement;
            const $inputchecked = $input.checked;
            const is_correct = (correct_opts.includes($input.value) && $inputchecked) || (!correct_opts.includes($input.value) && !$inputchecked);
            if (is_correct) {
                $opt.classList.add('_fb-correct');
                $input.readOnly = true;
                $input.disabled = true;
            } else {
                $opt.classList.add('_fb-wrong');
                $fbtext.innerHTML = defaultDetails.fb_wrong;
            }
        });
        
        if ($fbtext.innerHTML === defaultDetails.fb_right) {
            // if all options are correct, set run as validated
            hemesample.setAsValidated(dateref); //console.log(hemesample, dateref);
            // update samplepg
            $samplepg.innerHTML = 'Validated';
            $samplepg.classList.add('selected');
        }
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
