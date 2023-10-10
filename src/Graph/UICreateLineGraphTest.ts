import { LineGraph, IChartData } from './UICreateLineGraph';
import { $graphscontainer } from '../UI/UIMonitor';

function simpletest() {
    var xData = ['Aug-1-2023', 'Aug-13-2023', 'Aug-31-2023'];
    var yData = [6, 7, 4];
    var chartData: IChartData = {
        canvasId: 'test',
        xData: xData,
        yData: yData,
        yTitle: 'WBC',
        yMin: 5,
        yMax: 10,
        sd: 1.5,
        mean: 6.5,
        cv: 0.23
    }

    const g1 = new LineGraph(chartData, $graphscontainer);
    g1.AddDataPoint('Sep-12-2023', 15);
    g1.AddDataPoint('Sep-13-2023', 4);
}
