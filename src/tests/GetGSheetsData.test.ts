import { GetData } from '../Data/GetGSheetsData';

test("should return data", () => {
    let data = GetData();
    data.then((data) => {
        expect(data).not.toBeNull();
    });
});