import { RunData } from "../Data/GetRunData";

/** Updates the samples page with the run data
 * 
 * @param run: RunData, the run data
 * @param $container: HTMLLIElement, the target container
 */
export function UpdateSamplesPage(run: RunData, $container: HTMLLIElement) {
    const runInfo = run.subgroups.runinfo;
    const patientinfo = run.subgroups.patientinfo;

    // get all div ids from $container #rowheader, including children
    const ids = $container.querySelectorAll('.rowheader [id]');
    console.log(ids, run);
    // clear all divs
    ids.forEach((id) => {
        id.replaceChildren();
        id.classList.remove('selected');
    });
    
    //get div with id 'samplepage-id` and update innerHTML with run id
    const $samplepageid = $container.querySelector('#samplepage-id');
    $samplepageid.innerHTML = run.id.toString();

    if (runInfo) {
        // get div with id 'samplepage-pn` and update w runinfo 'P /N'
        const $pn = $container.querySelector('#samplepage-pn');
        const pn_data = runInfo['P / N'] || '';
        const isPositive = pn_data.toLowerCase() == 'p';
        $pn.innerHTML = isPositive ? 'Positive' : 'Negative';
        if (isPositive) $pn.classList.add('selected');

        // get div with id 'samplepage-validated` and update w runinfo 'Validated'
        const $validated = $container.querySelector('#samplepage-validated');
        const validated_data = runInfo['Validated'] || '';
        const isValidated = validated_data.toLowerCase() == 'v';
        $validated.innerHTML = isValidated ? 'Validated' : 'Not Validated';
        if (isValidated) $validated.classList.add('selected');

        // get div with id 'samplepage-action` and update w runinfo 'Action'
        const $action = $container.querySelector('#samplepage-action');
        const isAction = runInfo['Action'].length > 0;
        $action.innerHTML = isAction ? 'Action' : '';
        if (isAction) $action.classList.add('selected');

        // get div with id 'samplepage-error` and update w runinfo 'Error'
        const $error = $container.querySelector('#samplepage-error');
        const isError = runInfo['Error'].length > 0;
        $error.innerHTML = isError ? 'Error' : '';
        if (isError) $error.classList.add('selected');

        const $none = $container.querySelector('#samplepage-none');
        
        if (!isAction && !isError) {
            $none.innerHTML = 'None';
            $none.classList.add('selected');
            
        }

        // get div with id 'samplepage-datetime` and update w runinfo Day,Time
        const $datetime = $container.querySelector('#samplepage-datetime');
        $datetime.innerHTML = runInfo['Day'] + ' ' + runInfo['Time'];

        
    }

    if (patientinfo) {
        // get div with id 'samplepage-patientid` and update w patientinfo id
        const $samplepagepatientid = $container.querySelector('#samplepage-patientid');
        $samplepagepatientid.innerHTML = patientinfo['Patient id'];

        // get div with id 'samplepage-patientname` and update w patientinfo name
        const $samplepagepatientname = $container.querySelector('#samplepage-name');
        $samplepagepatientname.innerHTML = patientinfo['name'];
    }


}
