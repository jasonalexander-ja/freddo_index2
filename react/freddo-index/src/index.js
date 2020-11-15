import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class KPI extends React.Component {
    render() {
        return(
            <div>
                <iframe title="kpi"></iframe>
            </div>
        )
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changeList: [{}],
            year: 0,
            currency: "",
            costPs: 0,
            exchangeRate: 0,
            currencyOptions: [{}],
        };
        this.getChangeObj();
    }
    getChangeObj() {
        fetchJSON("http://localhost:80/change-points.json").then(data => {
            this.setState({ 
                changeList: data.changePoints,
                year: new Date().getFullYear(),
                costPs: getPriceOnYear(data.changePoints, new Date().getFullYear()),
            });
            this.getCurrencyOptions();
        }).catch(e => { console.log("Error getting change data."); });
    }
    getCurrencyOptions() {
        fetchJSON("http://localhost:80/currency-values.json")
            .then(data => {
                this.setState({
                    currencyOptions: data.options,
                })
            })
            .catch(e => { console.log("Failed to get currency options."); })
    }
    getConversionObj() {
        const year = this.state ? this.state.year : new Date().getFullYear();
        fetchJSON(`https://api.exchangeratesapi.io/${year}-01-01?base=GBP`)
            .then(data => { 
                console.log(data.rates); 
            })
            .catch(e => { console.log("Failed to get conversion object."); });
    }
    render() {
        let options = this.state ? generateDateOptions(this.state.changeList) : [];
        return (
            <div>
                <h1 className="main_title">International Freddo Index</h1>
                <br />
                <label>Year: </label>
                <select 
                    id="year" 
                    onChange={() => { 
                        this.setState({
                            year: document.getElementById("year").value,
                            costPs: getPriceOnYear(this.state.changeList, document.getElementById("year").value),
                        }); 
                    }}
                >{options}
                </select>
                <label>Currency: </label>
                <KPI />
            </div>
        )
    }
}

function generateDateOptions(list) {
    let optionList = [];
    let years = list.map(val => new Date(val.x).getFullYear());
    for(let i = years[0]; i <= new Date().getFullYear(); i++) {
        optionList.push(<option key={i} value={i}>{i}</option>);
    }
    return optionList.reverse();
}

function getPriceOnYear(data, date) { 
    const range = data.map(val => {return {x: new Date(val.x).getFullYear(), y: val.y}});
    if(date < range[0].x) return range[0].y;
    if(date >= range[range.length - 1].x) return range[range.length - 1].y;
    for(let i = 0; i <= range.length - 2; i++){
        if(date >= range[i].x && date < range[i + 1].x) return range[i].y;
    }
    return 0;
}

async function fetchJSON(uri) {
    return fetch(uri).then(res => res.json());
}

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);
