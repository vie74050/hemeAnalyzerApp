import { CreateLineGraph } from '../Graph/CreateLineGraph';

var xData = ['Aug-1-2023', 'Aug-13-2023', 'Aug-31-2023'];
var yData = [10, 3, 4];
CreateLineGraph('graph1', 'WBC', 2, 5, xData, yData);

yData = [2, 13, 24];
CreateLineGraph('graph2', 'RBC', 2, 5, xData, yData);

yData = [2, 11, 12];
CreateLineGraph('graph3', 'RBC', 2, 5, xData, yData);

yData = [2, 1, 4];
CreateLineGraph('graph4', 'RBC', 2, 5, xData, yData);