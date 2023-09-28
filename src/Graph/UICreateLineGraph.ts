import Chart from 'chart.js/auto';

interface IChartData {
    canvasId: string,
    yTitle: string,
    yMin: number,
    yMax: number,
    xData: Array<any>,
    yData: Array<number>,
    sd?: number | string,
    mean?: number | string,
    cv?: number | string
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
    stat_meanHTML: HTMLTableCellElement;
    stat_cvHTML: HTMLTableCellElement;
    data: IChartData

    public constructor(chartData: IChartData) {
        this.data = chartData;        
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
        
        // set the title
        this.titleHTML = yTitle;
        this.canvas = canvas;
        
        return graphRow;
    }

    /** Create HTML for table for statistics, with the structure:
     *  <table>
            <tr>
                <td class="_cur" rowspan="3"></td>
                <td class="_sd"></td>
            </tr>
            <tr>
                <td class="_mean"></td>
            </tr>
            <tr>
                <td class="_cv"></td>
            </tr>
        </table>
     */
    UICreateDataStatsTableHTML(): HTMLTableElement {
        const table = document.createElement('table');
        const tr1 = document.createElement('tr');

        const td1_cur = document.createElement('td');
        td1_cur.classList.add('_cur');
        td1_cur.setAttribute('rowspan', '3');
        tr1.appendChild(td1_cur);

        const td2_sd = document.createElement('td');
        td2_sd.classList.add('_sd');
        tr1.appendChild(td2_sd);
        table.appendChild(tr1);

        const tr2 = document.createElement('tr');
        const td3_mean = document.createElement('td');
        td3_mean.classList.add('_mean');
        tr2.appendChild(td3_mean);
        table.appendChild(tr2);

        const tr3 = document.createElement('tr');
        const td4_cv = document.createElement('td');
        td4_cv.classList.add('_cv');
        tr3.appendChild(td4_cv);
        table.appendChild(tr3);

        // set stats data
        this.stat_meanHTML = td3_mean;
        this.stat_curHTML = td1_cur;
        this.stat_sdHTML = td2_sd;
        this.stat_cvHTML = td4_cv;

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
        const isHeadingRow = chartData.canvasId === 'headingRow';
       
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
        Chart.defaults.backgroundColor = '#9BD0F5';

        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
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
                            display: true,
                            padding: 0,
                            callback: function (val, index) {
                                const targW = 40;
                                let num = Number(val).toFixed(1).trim();

                                if( isHeadingRow ) {
                                    //console.log(index,val, target, num);
                                    num = (index === 0) ? 'min' : (index === 1) ? 'target' : 'max';
                                }

                                // ensure y tick labels are same width so graphs align
                                let w = ctx.measureText(num).width;   
                                while (w < targW) {
                                    num = num + ' ';
                                    w = ctx.measureText(num).width;
                                }
                                return num;
                                
                            }
                        },
                        grid: {
                            display: !( isHeadingRow )
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

    public CreateGraphHeader(): HTMLDivElement {
        const row = this.UICreateGraphRowHTML(this.data.canvasId);       
        this.chart = this.CreateLineChart(this.data) as Chart;

        this.titleHTML.innerHTML = this.data.yTitle;
        this.stat_sdHTML.innerHTML = this.data.sd.toString();
        this.stat_meanHTML.innerHTML = this.data.mean.toString();   
        this.stat_cvHTML.innerHTML = this.data.cv.toString();
        this.stat_curHTML.innerHTML = "Data"; 

        return row;
    }

    public CreateGraphRow(chartData: IChartData = this.data): HTMLDivElement {
        const row = this.UICreateGraphRowHTML(chartData.canvasId);       
        this.chart = this.CreateLineChart(chartData) as Chart;

        // set title
        this.titleHTML.innerHTML = this.data.yTitle;
        this.stat_sdHTML.innerHTML = this.data.sd.toString();
        this.stat_meanHTML.innerHTML = this.data.mean.toString();   
        this.stat_cvHTML.innerHTML = this.data.cv.toString();
        this.stat_curHTML.innerHTML = this.data.yData[this.data.yData.length - 1].toString();   
        
        return row;
    }

    /** Update the graph with new point */
    public AddDataPoint(xData: string = '', v: number): void {
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

    }

}
export { LineGraph, IChartData };

