import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Graph } from './graphing.js'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
            currency: "GBP",
            costPs: getPriceOnYear(this.props.changeObj, new Date().getFullYear()),
            exchangeRates: this.props.currentRates,
            exchangeRate: 1,
            error: false,
            errorMsg: "",
        };
    }
    updateYear(year) {
        const conversionObj = this.props.periodExchangeObj[`${year}`];
        if(!conversionObj) {
            this.setState({
                error: true,
                errorMsg: `Couldn't load exchange rates for year ${year}`,
            })
            return;
        }
        if(!conversionObj[this.state.currency]) {
            let curr = "";
            let code = this.state.currency;
            this.props.currencyOptions.forEach(obj => { if(obj.code === code) curr = obj.value; });
            this.setState({
                error: true,
                errorMsg: `No data for ${curr} for ${year}.`,
            });
            return;
        }
        this.setState({
            year: year,
            costPs: getPriceOnYear(this.props.changeObj, year),
            exchangeRates: conversionObj,
            exchangeRate: conversionObj[this.state.currency],
            error: false,
            errorMsg: "",
        });
    }
    updateCurrency(val) {
        if(this.state.exchangeRates[val])
            this.setState({
                exchangeRate: this.state.exchangeRates[val],
                currency: val,
                error: false,
                errorMsg: "",
            }); 
        else {
            let curr = "";
            this.props.currencyOptions.forEach(obj => { if(obj.code === val) curr = obj.value; });
            console.log(curr);
            this.setState({
                error: true,
                errorMsg: `No data for ${curr} for ${this.state.year}.`,
            }); 
        }
    }
    getGraphData() {
        const changes = this.props.changeObj;
        const dateRange = new Date().getFullYear() - new Date(changes[0].x).getFullYear();
        const startYear = new Date(changes[0].x).getFullYear();
        const currency = this.state.currency;
        let psDataset = [];
        for(let i = 0; i <= dateRange; i++) {
            psDataset.push({
                x: new Date(changes[0].x).getFullYear() + i, 
                y: getPriceOnYear(changes, startYear + i)
            });
        }
        let convertedDataset = [];
        psDataset.forEach((val, i) => {
            const rate = this.props.periodExchangeObj[startYear + i][currency]; 
            if(rate)
                convertedDataset.push({
                    x: val.x, 
                    y: parseFloat((val.y * rate).toFixed(2))
                });
        });
        return convertedDataset;
    }
    render() {
        let yearOptions = generateDateOptions(this.props.changeObj, this.props.periodExchangeObj, this.state.currency);
        let currencyOptions = this.props.currencyOptions.map(val => {
            let hidden = !(val.code in this.state.exchangeRates);
            return(
                <option 
                    value={val.code}
                    key={val.code}
                    hidden={hidden}
                >{val.value}</option>
            )
        });
        const graphData = this.getGraphData();
        return (
            <div>
                <h1 className="main_title">International Freddo Index</h1>
                <br />
                <label>Year: </label>
                <select 
                    id="year" 
                    value={this.state.year}
                    onChange={() => { this.updateYear(document.getElementById("year").value); }}
                >{yearOptions}
                </select>&nbsp;&nbsp;
                <label>Currency: </label>
                <select
                    id="currency"
                    value={this.state.currency}
                    onChange={() => {
                        this.updateCurrency(document.getElementById("currency").value);
                    }}
                >{currencyOptions}</select>&nbsp;&nbsp;
                <nobr className="text">{(this.state.costPs * this.state.exchangeRate).toFixed(2)}</nobr>&nbsp;&nbsp;
                <nobr className="errorText">{this.state.errorMsg}</nobr>
                <Graph 
                    className="mainKpi" 
                    graphWidth={400}
                    graphHeight={220}
                    graphData={graphData}
                    textClassName="kpiText"
                    xTextOffset={5}
                    yTextOffset={5}
                    lineClassName="line"
                />
            </div>
        )
    }
}

// General helper functions

function generateDateOptions(list, periodExchangeObj, currency) {
    let optionList = [];
    let years = list.map(val => new Date(val.x).getFullYear());
    for(let i = years[0]; i <= new Date().getFullYear(); i++) {
        if(currency in periodExchangeObj[i])
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


// Code to run to get static reasources prior to app start

async function getChangeObj() {
    return fetchJSON("http://localhost:80/change-points.json")
        .then(data => data.changePoints)
        .catch(e => { 
            console.log("Error getting change data."); 
            return [{"x": "1999-01-01T00:00:00.000Z", "y": 0}];
        });
}

async function getCurrencyOptions() {
    return fetchJSON("http://localhost:80/currency-values.json")
        .then(data => data.options)
        .catch(e => { 
            console.log("Failed to get currency options."); 
            return [{"code": "GBP", "value": "GB Pound Sterling"}]; 
        });
}
async function getCurrentRates() {
    return fetchJSON(`https://api.exchangeratesapi.io/${new Date().getFullYear()}-01-01?base=GBP`)
        .then(data => data.rates)
        .catch(e => { 
            console.log("Failed to get initial conversion object."); 
            return {"GBP": 1}
        });
} 
async function getPeriodExchangeRates(from, until) {
    let retObj = {};
    for(let i = from; i <= until; i++) {
        let json = await fetchJSON(`https://api.exchangeratesapi.io/${i}-01-01?base=GBP`)
            .then(data => data.rates)
            .catch(err => { 
                console.log(`Error getting exchange rates for period ${i}.`);
                return {"GPB": 1} 
            });
        retObj[i.toString()] = json;
    }
    return retObj;
}
async function main() {
    let changeObj = await getChangeObj();
    let currencyOptions = await getCurrencyOptions();
    let initConversionObj = await getCurrentRates();
    let periodExchangeRates = await getPeriodExchangeRates(new Date(changeObj[0].x).getFullYear(), new Date().getFullYear());
    ReactDOM.render(
        <Main
            changeObj={changeObj}
            currencyOptions={currencyOptions}
            currentRates={initConversionObj}
            periodExchangeObj={periodExchangeRates}
        />,
        document.getElementById('root')
    );
}
main();