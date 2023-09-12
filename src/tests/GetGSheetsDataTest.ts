import { GetData } from '../Data/GetGSheetsData';

let data = GetData();
data.then((data) => {
    console.log(data);
});
