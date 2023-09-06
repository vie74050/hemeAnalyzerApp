import './scss/styles.scss';
import $ from "jquery";
import * as GRAPH from './Graph/CreateLineGraph';

$(() => {
    var xData = ['Aug-1-2023','Aug-13-2023','Aug-31-2023'];
    var yData = [10, 3, 4];
    GRAPH.CreateLineGraph('graph1', 'WBC', 2, 5, xData, yData);

     yData = [2, 13, 24];
    GRAPH.CreateLineGraph('graph2', 'RBC', 2, 5, xData, yData);

     yData = [2, 11, 12];
    GRAPH.CreateLineGraph('graph3', 'RBC', 2, 5, xData, yData);

     yData = [2, 1, 4];
    GRAPH.CreateLineGraph('graph4', 'RBC', 2, 5, xData, yData);
});
