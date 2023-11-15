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

## Developer

### Set Up

To connect to Google sheets, an App Key is required, and was generated from [Cloud Developer Console](https://console.cloud.google.com/apis/credentials?project=quickstart-1556582949982).  

**NB** The current AppKey (`API Key MedLab`) is generated on BCITVie's account and is restricted to the testing domains specified in the console management.  

The `AppKey` should be stored in a `./.env`.

Install using `npm install`.

### Development

See package.json scripts:

- `npm test` - for testing using jest
- `npm run start` - for testing locally on `localhost:8080`
- `npm run deploy` - to deploy to test server (GitHub Pages). It will build to dist and deploy to `gh-pages` branch.

### External Libs

- [Google Sheets API](https://developers.google.com/sheets/api/guides/concepts)
- [Chart.js](https://www.chartjs.org/)

## Implentation

### Request vars

The parameters vars below can be passed with URL.  
See `Data/GetGSheetData.ts`.

- `id` the googlesheet (workbook) id
- `name` the googlesheet (sheet) name
