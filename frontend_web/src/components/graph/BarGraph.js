import React from "react";
import Chart from "chart.js";
import { useEffect } from "react";

const BarGraph = ({
    graphId,
    meta,
    title,
    extra = null,
    type = "bar",
    stacked = false,
}) => {
    useEffect(() => {
        const data = {
            datasets: meta.data,
            labels: meta.labels,
        };
        console.log(data);
        const options = {
            legend: {
                display: window.screen.width > 800,
                position: "top",
            },
            plugins: {
                datalabels: {
                    display: false,
                },
            },
            hover: {
                mode: "index",
                intersect: false,
            },
            tooltips: {
                displayColors: true,
                callbacks: {
                    mode: "x",
                },
            },
            scales: {
                xAxes: [
                    {
                        stacked: stacked,
                        gridLines: {
                            display: false,
                        },
                    },
                ],
                yAxes: [
                    {
                        stacked: stacked,
                        ticks: {
                            beginAtZero: meta.beginAtZero || false,
                            callback: function (value) {
                                return value.toLocaleString();
                            },
                            userCallback: function (label, index, labels) {
                                if (Math.floor(label) === label) {
                                    return label;
                                }
                            },
                        },
                        type: "linear",
                    },
                ],
            },
        };

        new Chart(document.getElementById(graphId), {
            type: type,
            data: data,
            options: options,
        });
    }, []);

    return (
        <div className={`graph-container bg-white card ${extra ? extra : ""}`}>
            <h6 className="pl-1">{title}</h6>
            <div>
                <canvas id={graphId} className="graph p-1" style={{}}></canvas>
            </div>
        </div>
    );
};

export default BarGraph;