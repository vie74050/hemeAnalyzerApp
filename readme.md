# Heme Anylzer Interactive

## Team

Project start: August 2023  
SMEs: Sonja Turnbull <sonja_turnbull@bcit.ca>, Tammy Hardie <Tammy_Hardie@bcit.ca>  
Dev: Vienna Ly  
3D Modeller: Jason Yu

copyright: for BCIT use only

## Overview

This web app simulates a generalized User Interface of a Heme Analyzer.  
Sample data is retrieved from Google sheets.  This allows instructors to generate sample data for various use cases TBD.

## DEVELOPMENT

### Set Up Google App Key

To connect to Google sheets, an App Key is required, and was generated from [Cloud Developer Console](https://console.cloud.google.com/apis/credentials?project=quickstart-1556582949982).  

**NB** The current AppKey (`API Key MedLab`) is generated on BCITVie's account and is restricted to the testing domains specified in the console management.  

The `AppKey` should be stored in a `./.env`.

### Set up node

`nvm install v12.16.1` The version compatible with the node-sass module version used.  If already installed (check using `nvm list`), make sure to switch to version, i.e. `nvm use`

Install using `npm install`.

See `package.json` scripts:

- `npm test` - for testing using jest
- `npm run start` - for testing locally on `localhost:8080`
- `npm run deploy` - to deploy to test server (GitHub Pages). It will build to `./dist` and deploy to `gh-pages` branch.

#### Unity WebGL model

The Unity 3D model project files is a separate repo, `HemeAnalyzer-Unity`, using editor version 2022.1.7f1.  
The build target is the `dist/UnityModel` folder.

#### External libs documentation

- [Unity WebGL communication](https://docs.unity3d.com/2022.1/Documentation/Manual/webgl-interactingwithbrowserscripting.html) for documentation on interacting with browser scripting.
- [Google Sheets API](https://developers.google.com/sheets/api/guides/concepts)
- [Chart.js](https://www.chartjs.org/)

## USAGE

### Request vars

The parameters vars below can be passed with URL.  
See `Data/GetGSheetData.ts`.

- `id` the googlesheet (workbook) id
- `name` the googlesheet (sheet) name

### Spreadsheet Setup Notes

For the latest notes on spreadsheet data, see any associated Notes in the [sample spreadsheet](https://docs.google.com/spreadsheets/d/1QCDTOlikbl3E0CjCcmjNOfPrl1veu1C1j6tBtlXKI_o/edit?usp=sharing).

#### Groups

The `Groups` for each line item must point to the main sample ID (`Item`) to which the data belongs.
![image](https://github.com/vie74050/hemeAnalyzerApp/assets/5272116/812d26df-920e-4984-854e-d44935e93e42)

#### Subgroup

Sample items must be in either:

- `QCSample`
- `PASample`
- `MASample`

The parameters for the sample can have the following options:  

- `HAParameter`
- `PatientInfo`
- `ReagentInfo`
- `RunInfo`
- `Other`

#### Status

If ranges are specified, use the formula in the `Status` column to check if any run `HAParameter` are out of range:

```sheets
=IF(ArrayFormula(COUNT(if(Q13:W37<$H13:$H37,1),if(Q13:W37>$I13:$I37,1)))>0, "Err-range", "OK")
```

- helper formula to verify sheet

#### Analysis dates -->

The formula should concatenate all the dates required for the sample.

```sheets
=TEXTJOIN("; ", TRUE, Q2:2)
```

- Helper formula to set which dates to use.  If blank, then all `date{{n}}` columns that are not blank will be used.

- The **Date**{{n}} columns (start from column Q)
- Adjust cell end points as needed to specify the columns with data

#### Presenting

This column should get the current date `=now()`.

Parameters only require data in this column **if** they will be associated with the current run, ie. if there are associated parater values, then these `Presenting` will be added when user clicks to `Run` sample(s). Otherwise, no data means only historical run data are available.
