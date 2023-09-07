import './scss/styles.scss';
import $ from "jquery";
import './Graph/GAPIAuth';
import { GAPIAuth } from './Graph/GAPIAuth';

$(() => {
    const sheetid = '1QCDTOlikbl3E0CjCcmjNOfPrl1veu1C1j6tBtlXKI_o',
        sheetname = 'QA';

    GAPIAuth(sheetid,sheetname);
    
});

