import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            changeList: [{"x": "1999-01-01T00:00:00.000Z", "y": 0.10},
            {"x": "2007-01-01T00:00:00.000Z", "y": 0.15},
            {"x": "2010-01-01T00:00:00.000Z", "y": 0.17},
            {"x": "2011-01-01T00:00:00.000Z", "y": 0.20},
            {"x": "2014-01-01T00:00:00.000Z", "y": 0.25},
            {"x": "2017-01-01T00:00:00.000Z", "y": 0.30},
            {"x": "2018-01-01T00:00:00.000Z", "y": 0.25}]
        }
    }
    generateDateOptions(list) {
        let optionList = [];
        let years = list.map(val => new Date(val.x).getFullYear());
        for(let i = years[0]; i <= new Date().getFullYear(); i++) {
            optionList.push(<option key={i}>{i}</option>);
        }
        return optionList.reverse();
    }
    render() {
        let options = this.generateDateOptions(this.state.changeList);
        return (
            <div>
                <h1 className="main_title">International Freddo Index</h1>
                <br />
                <label>Year: </label>
                <select>{options}</select>
                
                <label>Currency: </label>
            </div>
        )
    }
}

async function fetchJSON(uri) {
    return fetch(uri).then(res => res.json());
}

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);
