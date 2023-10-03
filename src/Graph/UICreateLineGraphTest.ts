import { LineGraph, IChartData } from './UICreateLineGraph';

function simpletest() {
    var xData = ['Aug-1-2023', 'Aug-13-2023', 'Aug-31-2023'];
    var yData = [6, 7, 4];
    var chartData: IChartData = {
        canvasId: 'test',
        xData: xData,
        yData: yData,
        yTitle: 'WBC',
        yMin: 5,
        yMax: 10
    }

    const g1 = new LineGraph(chartData);
    g1.AddDataPoint('Sep-12-2023', 15);
    g1.AddDataPoint('Sep-13-2023', 4);
}
