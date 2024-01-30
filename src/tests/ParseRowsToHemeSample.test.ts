import { CreateHemeSamplesFromRowData } from "../Data/ParseRowsToHemeSample";
import { parsedRowData } from "./testdata";

test("should return data", () => {
    let hemeSampleItems = CreateHemeSamplesFromRowData(parsedRowData);
    expect(hemeSampleItems).not.toBeNull();
    
    let item0 = hemeSampleItems[0];
    let item0_raw = item0.data;
    expect(item0_raw).not.toBeNull();
    expect(item0_raw).toHaveProperty('id');
    expect(item0_raw).toHaveProperty('item');
    expect(item0_raw).toHaveProperty('status');
    expect(item0_raw).toHaveProperty('analysisdates');
    expect(item0_raw).toHaveProperty('groups');
    expect(item0_raw['groups']).toBe('QCSample');

    expect(item0.id).toBe('qc001');
    expect(item0.GetItemsOfSubgroup('sampleinfo')).not.toBeNull();
    expect(item0.GetItemsOfSubgroup('sampleinfo')).toHaveProperty('material');
    expect(item0.GetItemsOfSubgroup('sampleinfo')).toHaveProperty('expirydate');
});
