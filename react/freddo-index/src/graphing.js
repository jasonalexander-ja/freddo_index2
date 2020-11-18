import React from 'react';

function Lables(xyObjStats, xTextOffset, yTextOffset, className, xNum, yNum, width, height, xOffset, yOffset) {
    const useableWidth = width - (2 * xOffset), useableHeight = height - (2 * yOffset);
    const xIncrement = xyObjStats.xRange / xNum, yIncrement = xyObjStats.yRange / yNum;
    const xPosIncrement = useableWidth / xNum, yPosIncrement = useableHeight / yNum;
    let labels = [];
    for(let i = 0; i <= xNum; i++) {
        let xPos = i * xPosIncrement;
        let text = parseFloat((xyObjStats.xMin + i * xIncrement).toFixed(0)).toString();
        labels.push(<text x={xOffset + xPos} y={height - xTextOffset} className={className} key={`x${i}`}>{text}</text>);
    }
    for(let i = 0; i <= yNum; i++) {
        let yPos = i * yPosIncrement;
        let text = parseFloat((xyObjStats.yMin + i * yIncrement).toFixed(2)).toString();
        labels.push(<text x={yTextOffset} y={height - yPos - yOffset} className={className} key={`y${i}`}>{text}</text>);
    }
    return labels;
}

export class GraphSettings {
    constructor() {
        this.graphHeight = 220;
        this.graphWidth = 400;
        this.textClassName = "";
        this.lineClassName = "";
        this.xTextOffset = 2;
        this.yTextOffset = 2;
        this.xPrecision = 2;
        this.yPrecision = 2;
        this.xLabels = 2;
        this.yLabels = 2;
        this.xOffset = 35;
        this.yOffset = 35;
    }
    setTextClass(className) {
        this.textClassName = className ? className : this.textClassName;
    }
    setLineClassName(className) {
        this.lineClassName = className ? className : this.lineClassName;
    }
    setSize(height, width) {
        this.graphHeight = height ? height : this.graphHeight;
        this.graphWidth = width ? width : this.graphWidth;
    }
    setTextOffset(x, y) {
        this.xTextOffset = x ? x : this.xTextOffset;
        this.yTextOffset = y ? y : this.yTextOffset;
    }
    setLabels(x, y) {
        this.xLabels = x ? x : this.xLabels;
        this.yLabels = y ? y : this.yLabels;
    }
    setPrecision(x, y) {
        this.xPrecision = x ? x : this.xPrecision;
        this.yPrecision = y ? y : this.yPrecision;
    }
    setOffsets(x, y) {
        this.xOffset = x ? x : this.xOffset;
        this.yOffset = y ? y : this.yOffset;
    }
}

export class Graph extends React.Component {
    constructor(props) {
        super(props)
        console.log('new Graph()');
        this.state = {
            graphHeight: 
                this.props.graphHeight ? this.props.graphHeight : 220,
            graphWidth: 
                this.props.graphWidth ? this.props.graphWidth : 400,
            textClassName: 
                this.props.className ? this.props.textClassName : "",
            lineClassName: 
                this.props.lineClassName ? this.props.lineClassName : "",
            xTextOffset:
                this.props.xTextOffset ? this.props.xTextOffset : 2,
            yTextOffset:
                this.props.yTextOffset ? this.props.yTextOffset : 2,
            xLabels:
                this.props.numXLabels ? this.props.numXLabels : 2,
            yLabels:
                this.props.numYLabels ? this.props.numYLabels : 2,
        }
    }


    render() {

        // Validating data, getting default values

        if(!isDatasetValid(this.props.graphData)) 
            return <p>Data set needs to contain at least 1 {"{{x: 0, y: 0}}"} array entry</p>;
        const xOffset = 
            this.props.xOffset ? this.props.xOffset : 35;
        const yOffset = 
            this.props.yOffset ? this.props.xOffset : 35;

        const xyStats = 
            getXYStats(this.props.graphData);
        const xyCoordinates = 
            getDisplayData(this.props.graphData, 
                xyStats, 
                this.state.graphWidth, 
                this.state.graphHeight, 
                xOffset,
                yOffset,
            );
        const labels = Lables(xyStats, 
            this.state.xTextOffset, 
            this.state.yTextOffset, 
            this.state.textClassName,
            this.state.xLabels,
            this.state.yLabels,
            this.state.graphWidth,
            this.state.graphHeight,
            xOffset,
            yOffset
        );
        let polylinePoints =  "";
        xyCoordinates.forEach(val => {
            polylinePoints += `${val.x},${val.y} `;
        });
        return (
            <div>
                <svg
                    width={`${this.props.graphWidth}`}
                    height={`${this.props.graphHeight}`}
                    className={this.props.className}
                >
                    <polyline 
                        points={polylinePoints} 
                        className={this.state.lineClassName}
                    />
                    {labels}
                </svg>
            </div>
        )
    }
}

function isDatasetValid(xyObjArr) {
    return ('x' in xyObjArr[0]) && ('y' in xyObjArr[0]);  
}

function getXYStats(xyObjArr) {
    let dataObj = xyObjArr.map(val => { return {x: val.x, y: parseFloat(val.y)} });
    let xMin = xyObjArr[0].x, xMax = 0;
    let yMin = dataObj[0].y, yMax = 0;
    dataObj.forEach(val => { 
        xMin = xMin > val.x ? val.x : xMin;
        xMax = xMax < val.x ? val.x : xMax;
        yMin = yMin > val.y ? val.y : yMin;
        yMax = yMax < val.y ? val.y : yMax;
     });
     const xRange = xMax - xMin;
     const yRange = (yMax - yMin).toFixed(2);
     return {
        xMin: xMin,
        yMin: yMin,
        xMax: xMax,
        yMax: yMax,
        xRange: xRange,
        yRange: yRange,
     }
}

function getDisplayData(xyObjArr, xyObjstats, w, h, xNegOffset, yNegOffset) {
    const height = h - (yNegOffset * 2), width = w - (xNegOffset * 2);
    let dataObj = xyObjArr.map(val => { return {x: val.x, y: parseFloat(val.y)} });
    let xMin = xyObjstats.xMin;
    let yMin = xyObjstats.yMin;
     const xRange = xyObjstats.xRange;
     const yRange = xyObjstats.yRange;
     const xMultiplier = width  / xRange, xOffset = 0 - xMin;
     const yMultiplier = height / yRange, yOffset = 0 - yMin;
     let convertedArr = dataObj.map(val => {
         return {
            x: Math.floor((val.x + xOffset) * xMultiplier) + xNegOffset,
            y: height - Math.floor((val.y + yOffset) * yMultiplier) + yNegOffset
        }
     });
     return convertedArr;
}

const graph = {
    Graph,
    GraphSettings
}

export default graph;
