import React from 'react';

function getDisplayData(Obj, w, h, offset) {
    const height = h - (offset * 2), width = w - (offset * 2);
    let dataObj = Obj.map(val => { return {x: val.x, y: parseFloat(val.y)} });
    let xMin = dataObj[0].x, xMax = 0;
    let yMin = dataObj[0].y, yMax = 0;
    dataObj.forEach(val => { 
        xMin = xMin > val.x ? val.x : xMin;
        xMax = xMax < val.x ? val.x : xMax;
        yMin = yMin > val.y ? val.y : yMin;
        yMax = yMax < val.y ? val.y : yMax;
     });
     const xRange = xMax - xMin;
     const yRange = (yMax - yMin).toFixed(2);
     const xMultiplier = width  / xRange, xOffset = 0 - xMin;
     const yMultiplier = height / yRange, yOffset = 0 - yMin;
     let convertedArr = dataObj.map(val => {
         return {
            x: Math.floor((val.x + xOffset) * xMultiplier) + offset,
            y: height - Math.floor((val.y + yOffset) * yMultiplier) + offset
        }
     });
     return  {
        xMin: xMin,
        yMin: yMin,
        xMax: xMax,
        yMax: yMax,
        xRange: xRange,
        yRange: yRange,
        convertedArr: convertedArr,
    };
}

export class Graph extends React.Component {
    render() {
        const xyCoordinates = getDisplayData(this.props.graphData, this.props.graphWidth, this.props.graphHeight, 35);
        let polylinePoints =  "";
        xyCoordinates.convertedArr.forEach(val => {
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
                        className="line"
                    />
                </svg>
            </div>
        )
    }
}

export default { Graph };
