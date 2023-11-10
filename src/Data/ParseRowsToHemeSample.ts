import "../helpers/string-exts";
import { HemeSampleItem, QCSampleItem } from "./HemeSampleItem";

/** Groups from sheet data to use as HemeSampleItem type */
export enum hemeGroups { qc='QCSample' , pa='PASample', ma='MASample'};

/** Parse row data to create HemeSamples 
 * for Groups = QCSample or PA Sample 
 * aggregates all subgroups of the sample 
 * @data - parsed row data from google sheet
 */
export function CreateHemeSamplesFromRowData(data: Record<string, string>[]): HemeSampleItem[] {
   
    if (data === null) {
        return [];
    }

    const hemeSamples: HemeSampleItem[] = [];
    for (const row of data) {
        const group = row.Subgroup;

        // check if group is a valid hemeGroup
        let validGroup = false;
        for (let key in hemeGroups) {
            if (group === hemeGroups[key]) {
                row.Groups = group;
                validGroup = true;
                break;
            }
        }

        if (validGroup) { 
            // filter Record<string, string> for each row only if value is not null

            let itemInfo: Record<string, string | object> = Object.keys(row)
                .filter(key => row[key] != null && row[key] != undefined && row[key].length > 0)
                .reduce((obj, key) => {
                    obj[key.scrub()] = row[key]; 
                    return obj;
                }, {});

            itemInfo['id'] = row.Item.scrub();
            itemInfo['label'] = row.Label.length > 0 ? row.Label : row.Item;
            
            let subgroupsArr = [];

            // get all items in data where groups = row['Item']
            const itemsInGroup = data.filter(item => item.Groups === row.Item);

            // create itemInfo for each subgroup            
            for (const subgroupInfoItem of itemsInGroup) {
               
                let subgroupInfo: Record<string, string> = Object.keys(subgroupInfoItem)
                    .filter(key => subgroupInfoItem[key] != null && subgroupInfoItem[key] != undefined && subgroupInfoItem[key].length > 0)
                    .reduce((obj, key) => {
                        obj[key.scrub()] = subgroupInfoItem[key];
                        return obj;
                    }, {});

                let subgroupitemId = subgroupInfo['item'].scrub();
                let subgroupRef = subgroupInfo.subgroup.scrub();
                if (subgroupsArr[subgroupRef]) {
                    subgroupsArr[subgroupRef][subgroupitemId] = subgroupInfo;
                }else {
                    subgroupsArr[subgroupRef] = {};
                    subgroupsArr[subgroupRef][subgroupitemId] = subgroupInfo;
                }
               
            }
            
            itemInfo['subgroups'] = subgroupsArr;
            if (group === hemeGroups.qc) {
                hemeSamples.push(new QCSampleItem(itemInfo));
            }else {
                hemeSamples.push(new HemeSampleItem(itemInfo));
            }

        }
    }
  
    return hemeSamples;
}

