import Chart from 'chart.js/auto';


export function CreateLineGraph(
    canvasId: string,
    yTitle: string,
    yMin: number,
    yMax: number,
    xData: Array<any>,
    yData: Array<any>

) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {// TODO: create canvas element ? 
        console.error('Canvas element not found.');
        return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error('Canvas context not supported.');
        return;
    }

    const canvasHeight = canvas.height;
    const target = (yMax + yMin)/2;
    const data = {
        labels: xData,
        datasets: [{
            data: yData.map( (v,i) => ( v < yMin? yMin : v > yMax? yMax : v) ),
            // draw outofbounds values in red and cross
            pointBackgroundColor: function(context) {
                
                var value = yData[context.dataIndex]; 
                return value < yMin || value > yMax? 'red' :  'green';
                    
            },
            pointStyle: function(context) {

                var value = yData[context.dataIndex];
                return value < yMin || value > yMax? 'rectRot' :  'rect';
            }

        }]
    }

    // Calculate y-scale
    const yScale = (canvasHeight - 100) / (yMax - yMin);

    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.elements.line.borderWidth = 1;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.elements.point.hitRadius = 2;
    Chart.defaults.elements.point.radius = 5;
    
    new Chart(ctx, {
        type: 'line',
        
        data: data,
        options: {
        
            scales: {
                x: {
                    ticks: {
                        display: false //this will remove only the label
                    }
                },
                y:{
                    title: {display: true, text:yTitle},
                    min: yMin, 
                    max: yMax,
                    offset: true,
                    ticks: {
                        stepSize: target, 
                        major: {
                            enabled: true
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
                        label: function(context) {
                            return yData[context.dataIndex]; 
                        }
                    }
                }
            }
        }

    });

}