import { googData } from "../tests/testdata";'./testdata';

interface ISpreadsheetValues {
    majorDimension: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS";
    range: string;
    values: string[][];
}

// Default google worksheet id
var spreadsheetId = "1QCDTOlikbl3E0CjCcmjNOfPrl1veu1C1j6tBtlXKI_o";
// Default sheet name(s) within worksheet 
var sheetname = 'sampleData1';

const data_for_testing = googData as ISpreadsheetValues;

var DATA: Record<string, string>[];

/** Load sheet data from specified google sheet.
 * If _GET params are passed in URL, they override the Defaults.
 * - `id` = google worksheet id
 * - `name` = sheet name(s) within worksheet
 * - require API_KEY in ./.envs to be set
*/
async function LoadGSheetsData(): Promise<Record<string, string>[] | null>{
    // get credentials from .env using dot-env
    const apiKey = process.env.API_KEY;
    // the google worksheet id
    const get_id = findGetParameters('id');
    // the sheet name(s) within worksheet 
    const get_name = findGetParameters('name');

    let data: ISpreadsheetValues;
    
    // _GET param overrides defaults
    if (get_id.length>0) spreadsheetId = get_id;
    if (get_name.length>0) sheetname = get_name;

    if (!apiKey) {
        console.error('app key error');
        process.exit(1);
    } else {

        try {
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetname}?key=${apiKey}`,
                { 
                    mode: "cors",
                    headers: { 
                        "Content-Type": "application/json"
                    }
                }
            );
            if (!response.ok) throw response.statusText;
            data = await response.json();
            DATA = parseDataToArrayRows(data);

            //console.log("sheet loaded", spreadsheetId, sheetname, data);
            return DATA;
        } catch (e) {
            console.error("Error fetching spreadsheet data:", e, sheetname, spreadsheetId);
            
            DATA = parseDataToArrayRows( data_for_testing ); 
            console.log("loading test data", DATA);

            return DATA;
        }
    }

}

/** Get set up parameters from _GET
 * @param {string} key param name to get 
 * @returns {string} value where key matches paramName 
 */
function findGetParameters(key: string = '') {
    var result = '';
    location.search
        .substring(1)
        .split("&")
        .forEach(function (item) {
            let tmp = item.split('=');
            if ((key == '' || key == tmp[0]) && tmp[0] != '') {
                result = tmp[1];
            }
        });

    return result;
}

/** Parses data from google sheets to rows
 * @param data Incoming data returned from Google Sheets API 
 * @returns Rocord<string, string>[] Array of rows with headers as key
 */
function parseDataToArrayRows(data: ISpreadsheetValues): Record<string, string>[] {

    const rows: Record<string, string>[] = [];
    const rawRows: string[][] = Object.assign([], data["values"]);
    const headers: string[] = rawRows.shift() as string[];
    for (const row of rawRows) {
        const rowData = row.reduce<Record<string, string>>((acc, cell, index) => {
            acc[headers[index]] = cell;
            return acc;
        }, {});

        rows.push(rowData);
    }

    return rows;
}

/** Returns DATA or calls LoadGSheetsData() if DATA is undefined
*  @returns Promise<Record<string, string>[]  
*/
async function GetData(): Promise<Record<string, string>[] | null> {

    if (DATA === undefined) {
        let DATA = await LoadGSheetsData();
        
        return DATA;

    }else {
        return DATA;
    }
    
}   

export { GetData };
