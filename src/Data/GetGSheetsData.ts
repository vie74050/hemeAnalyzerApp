interface ISpreadsheetValues {
    majorDimension: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS";
    range: string;
    values: string[][];
}

// Default google worksheet id
var spreadsheetId = "1QCDTOlikbl3E0CjCcmjNOfPrl1veu1C1j6tBtlXKI_o";
// Default sheet name(s) within worksheet 
var sheetname = 'SampleData';

var DATA: Record<string, string>[];

/** Load sheet data from specified google sheet.
 * If _GET params are passed in URL, they override the Defaults.
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
    if (get_id.length>0) spreadsheetId = findGetParameters('id');
    if (get_name.length>0) sheetname = findGetParameters('name');

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
            data = await response.json();

            DATA = parseData(data);
            return DATA;
        } catch (e) {
            console.error("Error fetching spreadsheet data:", e, sheetname, spreadsheetId);
            return null;
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

/** Parses data to rows
 * @param data Incoming data returned from Google Sheets API 
 * @returns Rocord<string, string>[] Array of rows with headers as key
 */
function parseData(data: ISpreadsheetValues): Record<string, string>[] {

    const rows: Record<string, string>[] = [];
    const rawRows: string[][] = data.values || [[]];
    const headers: string[] = rawRows.shift() || [];
    for (const row of rawRows) {
        const rowData = row.reduce<Record<string, string>>((acc, cell, index) => {
            acc[headers[index]] = cell;
            return acc;
        }, {});

        rows.push(rowData);
    }

    return rows;
}

async function GetData(): Promise<Record<string, string>[] | null> {

    if (DATA === undefined) {
        let data = await LoadGSheetsData();
        return data;

    }else {
        return DATA;
    }
    
}   

export { GetData };
