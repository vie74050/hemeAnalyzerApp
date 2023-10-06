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
    minHTML: HTMLTableCellElement;
    targetHTML: HTMLTableCellElement;
    maxHTML: HTMLTableCellElement;
    stat_curHTML: HTMLTableCellElement;
    stat_sdHTML: HTMLTableCellElement;
    stat_meanHTML: HTMLTableCellElement;
    stat_cvHTML: HTMLTableCellElement;
    _maxPointsPerPg: number = 5;
    data: IChartData

    public constructor(chartData: IChartData, $container: HTMLElement) {
        this.data = chartData;

        // create HTML elements
        const row = this.UICreateGraphRowHTML(chartData.canvasId);
                
        // set content text
        if (chartData.canvasId == 'headingRow') {
            this.titleHTML.innerHTML = this.data.yTitle;
            this.maxHTML.innerHTML = 'max';
            this.targetHTML.innerHTML = 'target';
            this.minHTML.innerHTML = 'min';
            this.stat_sdHTML.innerHTML = this.data.sd.toString();
            this.stat_meanHTML.innerHTML = this.data.mean.toString();
            this.stat_cvHTML.innerHTML = this.data.cv.toString();
            this.stat_curHTML.innerHTML = 'Data';
            
            // the headingRow graph scrollbar will controll the other graphs
            const graphElem = this.canvas.parentElement;
            graphElem.classList.add('headingRow');
            graphElem.addEventListener('scroll', function(){
                //console.log(this.scrollLeft);
                const graphs = document.querySelectorAll('.graph');
                graphs.forEach((g)=>{
                    g.scrollLeft = this.scrollLeft;
                });
            });
        } else {
            // set title
            this.titleHTML.innerHTML = this.data.yTitle;
            // set yaxis labels
            this.maxHTML.innerHTML = String(this.data.yMax.toFixed(2)).padEnd(3, '0');
            this.targetHTML.innerHTML = ((this.data.yMax + this.data.yMin) / 2).toFixed(2).padEnd(3, '0');
            this.minHTML.innerHTML = String(this.data.yMin.toFixed(2)).padEnd(3, '0');
            // set stats
            this.stat_sdHTML.innerHTML = String(Number(this.data.sd).toFixed(2)).padEnd(3, '0');
            this.stat_meanHTML.innerHTML = String(Number(this.data.mean).toFixed(2)).padEnd(3, '0');
            this.stat_cvHTML.innerHTML = String(Number(this.data.cv).toFixed(2)).padEnd(3, '0');
            this.stat_curHTML.innerHTML = String(Number(this.data.yData[this.data.yData.length - 1])
                                        .toFixed(2)).padEnd(3, '0');
        }

        $container.appendChild(row);

        // create chart
        this.CreateLineChart(chartData);
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

        const dataSummary_yaxis = document.createElement('div');
        dataSummary_yaxis.classList.add('dataSummary', 'yaxis');
        const table_yaxis = this.UICreateYAxisHTML();
        dataSummary_yaxis.appendChild(table_yaxis);
        graphRow.appendChild(dataSummary_yaxis);


        const graph = document.createElement('div');
        graph.classList.add('graph');
        graphRow.appendChild(graph);

        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', graphId);
        graph.appendChild(canvas);

        const dataSummary_stats = document.createElement('div');
        dataSummary_stats.classList.add('dataSummary', 'stats');
        const table_stats = this.UICreateDataStatsTableHTML();
        dataSummary_stats.appendChild(table_stats);
        graphRow.appendChild(dataSummary_stats);

        // set the title
        this.titleHTML = yTitle;
        this.canvas = canvas;

        return graphRow;
    }

    /** Create HTML for y-axis */
    UICreateYAxisHTML(): HTMLTableElement {
        const yAxis = document.createElement('table');

        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.classList.add('_max');
        tr1.appendChild(td1);

        const tr2 = document.createElement('tr');
        const td2 = document.createElement('td');
        td2.classList.add('_target');
        tr2.appendChild(td2);

        const tr3 = document.createElement('tr');
        const td3 = document.createElement('td');
        td3.classList.add('_min');
        tr3.appendChild(td3);

        yAxis.appendChild(tr1);
        yAxis.appendChild(tr2);
        yAxis.appendChild(tr3);

        this.maxHTML = td1;
        this.targetHTML = td2;
        this.minHTML = td3;

        return yAxis;
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
        Chart.defaults.plugins.legend.display = false;
        Chart.defaults.elements.line.borderWidth = 1;
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.elements.point.hitRadius = 2;
        Chart.defaults.elements.point.radius = 5;
        
        const yMin = chartData.yMin, yMax = chartData.yMax;
        const target = (yMax + yMin) / 2;
        const isHeadingRow = chartData.canvasId === 'headingRow';
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Canvas context not supported.');
            return;
        }

        const xData = JSON.parse(JSON.stringify(chartData.xData)),
            yData = JSON.parse(JSON.stringify(chartData.yData));

        // determine max canvas size
        const maxPointsPerPg = this._maxPointsPerPg;
        const pgWidth = canvas.parentElement.clientWidth;
        canvas.style.height = '98px';
        canvas.height = 98;
        

        // if xData.length > maxPointsPerscreen, increase canvas size
        let numpages = Math.ceil(chartData.xData.length / maxPointsPerPg);
        // set graph width
        canvas.style.width = pgWidth * numpages + 'px';
        canvas.width = pgWidth * numpages;

        // fill out xData with empty strings if not enough data
        if (chartData.xData.length < maxPointsPerPg && chartData.xData.length > 0) {
            for (let i = xData.length; i < maxPointsPerPg; i++) {
                xData.push('');
            }
        }

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

        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: false,
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
                                enabled: false
                            },
                            display: false,
                            padding: 0,
                            callback: function (val, index) {
                                const targW = 40;
                                let num = Number(val).toFixed(1).trim();

                                if (isHeadingRow) {
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
                            display: !(isHeadingRow) // no grid on heading row
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

    set maxPointsPerPg(val: number) {
        this._maxPointsPerPg = val;
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

}
export { LineGraph, IChartData };

