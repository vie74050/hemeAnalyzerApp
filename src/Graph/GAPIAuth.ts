interface SpreadsheetValues {
    majorDimension: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS";
    range: string;
    values: string[][];
}

export function GAPIAuth(
    sheetid: string,
    sheetname: string
) {
    // get credentials from .env using dot-env
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        console.error('app key error');
        process.exit(1);
    } else {
        // gets google api and access sheet
        const data = getSpreadsheetValues(sheetid, sheetname);
        data.then((d) => { parseData(d) });
    }
}

async function getSpreadsheetValues(
    id: string,
    sheet: string
): Promise<SpreadsheetValues | null> {
    const apiKey = process.env.API_KEY;
    let data: SpreadsheetValues;

    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}?key=${apiKey}`
        );
        data = await response.json();
        return data;
    } catch (e) {
        //console.error("Error fetching spreadsheet data:", e);
        // TODO remove -- troubleshoot: try https://sheets.googleapis.com/v4/spreadsheets/1xeVzKLAOg9v3SfW19h8fcqbQ0iJBnlMxHMEyMq3rKEg/values/QADemo?key=AIzaSyCCp5-bFaSDrDSUp7vnco8GHV2b9QLazsQ
        return null;
    }
}

function parseData(data: SpreadsheetValues) {
    
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

    console.log(rows);
}