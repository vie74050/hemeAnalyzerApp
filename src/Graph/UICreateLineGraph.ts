import Chart from 'chart.js/auto';

interface IChartData {
    canvasId: string,
    yTitle: string,
    yMin: number,
    yMax: number,
    xData: Array<any>,
    yData: Array<number>
}

/**
 * Creates a line graph row and addes to the graphscontainer element. 
 * @param chartData data for the chart
 * @param graphscontainerID id of the container element, default is 'graphscontainer'
 */
class LineGraph {
    chart: Chart;
    canvas: HTMLCanvasElement;
    titleHTML: HTMLDivElement;
    stat_curHTML: HTMLTableCellElement;
    stat_sdHTML: HTMLTableCellElement;
    stat_avgHTML: HTMLTableCellElement;
    stat_cvHTML: HTMLTableCellElement;
    data: IChartData

    public constructor(chartData: IChartData, graphscontainerID: string = 'graphscontainer') {
        this.data = chartData;

        let container = document.getElementById(graphscontainerID);
        if (!container) {
            console.error('Graphs container not found.');
        }
        const row = this.UICreateGraphRowHTML(chartData.canvasId);
        container.appendChild(row);

        this.canvas = row.querySelector('canvas') as HTMLCanvasElement;

        this.chart = this.CreateLineChart(chartData) as Chart;

        this.titleHTML = row.querySelector('._yTitle') as HTMLDivElement;
        this.stat_avgHTML = row.querySelector('._avg') as HTMLTableCellElement;
        this.stat_curHTML = row.querySelector('._cur') as HTMLTableCellElement;
        this.stat_sdHTML = row.querySelector('._sd') as HTMLTableCellElement;
        this.stat_cvHTML = row.querySelector('._cv') as HTMLTableCellElement;
    }

    /** Create HTML elements for .graphrow with the structure
     *  <div class="graphrow">
            <div class="_yTitle"></div>
            <div class="graph"><canvas id="{{graphid}}"></canvas></div>
            <div class="dataSummary">
            </div>
        </div>
     */
    UICreateGraphRowHTML(graphId: string): HTMLDivElement {
        const graphRow = document.createElement('div');
        graphRow.classList.add('graphrow');

        const titleCol = document.createElement('div');
        const yTitle = document.createElement('div');
        yTitle.classList.add('_yTitle', 'ytitle');
        yTitle.innerHTML = this.data.yTitle;
        titleCol.classList.add('titleCol');
        titleCol.appendChild(yTitle);
        graphRow.appendChild(titleCol);

        const graph = document.createElement('div');
        graph.classList.add('graph');
        graphRow.appendChild(graph);

        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', graphId);
        graph.appendChild(canvas);

        const dataSummary = document.createElement('div');
        dataSummary.classList.add('dataSummary');
        graphRow.appendChild(dataSummary);

        const table = document.createElement('table');
        dataSummary.appendChild(table);
        table.appendChild(this.UICreateDataStatsTableHTML());

        return graphRow;
    }

    /** Create HTML for table for statistics, with the structure:
     *  <table>
            <tr>
                <td class="_cur" rowspan="3"></td>
                <td class="_sd"></td>
            </tr>
            <tr>
                <td class="_avg"></td>
            </tr>
            <tr>
                <td class="_cv"></td>
            </tr>
        </table>
     */
    UICreateDataStatsTableHTML(): HTMLTableElement {
        const table = document.createElement('table');
        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.classList.add('_cur');
        td1.setAttribute('rowspan', '3');
        tr1.appendChild(td1);
        const td2 = document.createElement('td');
        td2.classList.add('_sd');
        tr1.appendChild(td2);
        table.appendChild(tr1);

        const tr2 = document.createElement('tr');
        const td3 = document.createElement('td');
        td3.classList.add('_avg');
        tr2.appendChild(td3);
        table.appendChild(tr2);

        const tr3 = document.createElement('tr');
        const td4 = document.createElement('td');
        td4.classList.add('_cv');
        tr3.appendChild(td4);
        table.appendChild(tr3);

        return table;
    }
    /** Create a line graph with chartjs 
     * @param canvasId id of the canvas element
     * @param yMin minimum value of the y-axis  
     * @param yMax maximum value of the y-axis
     * @param xData array of x-values
     * @param yData array of y-values
    */
    CreateLineChart(chartData: IChartData): Chart | undefined {
        const yMin = chartData.yMin,
            yMax = chartData.yMax,
            xData = chartData.xData,
            yData = chartData.yData;
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');
       
        if (!ctx) {
            console.error('Canvas context not supported.');
            return;
        }

        const target = (yMax + yMin) / 2;
        const data = {
            labels: xData,
            datasets: [{
                data: yData.map((v, i) => (v < yMin ? yMin : v > yMax ? yMax : v)),

                pointBackgroundColor: function (context) {
                    // draw outofbounds values in red 
                    var value = yData[context.dataIndex];
                    return value < yMin || value > yMax ? 'red' : 'green';

                },
                pointStyle: function (context) {
                    // draw outofbounds values as a rotated rectangle
                    var value = yData[context.dataIndex];
                    return value < yMin || value > yMax ? 'rectRot' : 'rect';
                }

            }]
        }

        Chart.defaults.plugins.legend.display = false;
        Chart.defaults.elements.line.borderWidth = 1;
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.elements.point.hitRadius = 2;
        Chart.defaults.elements.point.radius = 5;

        const chart = new Chart(ctx, {
            type: 'line',

            data: data,
            options: {

                scales: {
                    x: {
                        ticks: {
                            display: false //this will remove only the label
                        }
                    },
                    y: {
                        title: { display: false },
                        min: yMin,
                        max: yMax,
                        offset: true,
                        alignToPixels: true,
                        backgroundColor: 'rgba(220, 250, 250, 0.5)',
                        ticks: {
                            stepSize: target,
                            major: {
                                enabled: true
                            },
                            padding: 0,
                            callback: function (val, index) {
                                const targW = 40;
                                // ensure y tick labels are same width so graphs align
                                let num = Number(val).toFixed(1).trim();
                                let w = ctx.measureText(num).width;   
                                while (w < targW) {
                                    num = num + ' ';
                                    w = ctx.measureText(num).width;
                                }
                                                  
                                return num;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'point'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return yData[context.dataIndex].toString();
                            }
                        }
                    }
                }
            }

        });

        return chart;
    }

    // helper math functions
    getMean(array: number[]): number {
        const n = array.length;
        return array.reduce((a, b) => a + b) / n;
    }
    getStandardDeviation(array: number[]): number {
        const n = array.length;
        const mean = this.getMean(array);
        return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
    }
    getCV(array: number[]): number {
        const mean = this.getMean(array);
        const sd = this.getStandardDeviation(array);
        return sd / mean;
    }

    /** Update the data summary table with the current, average and coefficient of variation values */
    uiUpdateDataSummaryTable(currVal: number): void {
        var newdata = this.data.yData;

        this.stat_avgHTML.innerText = this.getMean(newdata).toFixed(1);
        this.stat_curHTML.innerText = currVal.toFixed(1);
        this.stat_sdHTML.innerText = this.getStandardDeviation(newdata).toFixed(1);
        this.stat_cvHTML.innerText = this.getCV(newdata).toFixed(1);
    }

    /** Update the data summary table with the current, average and coefficient of variation values */
    public AddDataPoint(xData: string = '', v: number = -1): void {
        const chart = this.chart;
        // newy - the value that is plotted on the chart if out of range
        const newy = v < this.data.yMin ? this.data.yMin : v > this.data.yMax ? this.data.yMax : v;

        if (xData.length > 0) {
            this.data.yData.push(v);
            this.data.xData.push(xData);
            chart.data.labels.push(xData);
            chart.data.datasets[0].data.push(newy);
            chart.update();
        }

        this.uiUpdateDataSummaryTable(v);
    }

}
export { LineGraph, IChartData };

