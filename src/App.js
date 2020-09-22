import React, {Component} from 'react';
import './App.css';
import Jumbotron from 'react-bootstrap/Jumbotron';


class App extends Component {

    constructor(props) {
        super(props);
        this.currencies = ["AUD", "CAD", "CHF", "CNY", "INR", "USD", "EUR", "GBP", "JPY", "NZD", "NOK"];
        this.cached = {};
        this.state = {
            base: "NOK",
            other: "EUR",
            value: 0,
            converted: 0
        };
    }

    componentDidMount() {
        document.title = "Exchange"
    }

    render() {
        return(
            <div>
                <nav className="navbar navbar-light bg-info">
                    <span className="navbar-brand mb-0 h1">Valuta kalkulator</span>
                </nav>
                <div id="background">
                    <div id="container">
                        <div className="jumbotron">
                            <h1 className="header">
                                Kalkuler valutaen her
                            </h1>
                        </div>

                        <div id="inputs">
                            <select className="form-control" onChange={this.makeSelection} name="base" value={this.state.base}>
                                {this.currencies.map(currency => <option key={currency} value={currency}>{currency}</option>)}
                            </select>
                            <input className="input-group mb-3" value={this.state.value} onChange={this.changeValue}/>
                        </div>
                        <div id="inputs">
                            <select className="form-control" onChange={this.makeSelection} name="other" value={this.state.other}> 
                                {this.currencies.map(currency => <option key={currency} value={currency}>{currency}</option>)}
                            </select>
                            <input className="input-group mb-3" disabled={true} value={this.state.converted === null ? "Calculating..." : this.state.converted} />
                        </div>                 
                    </div>
                </div>
            </div>
        )
    }

    makeSelection = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        }, this.recalculate);
    }

    changeValue = (event) => {
        this.setState({
            value: event.target.value,
            converted: event.target.value === "" ? "" : null
        }, this.recalculate);

    }

    recalculate = () => {
        const value = parseFloat(this.state.value)
        if(isNaN(value)) {
            return;
        }

        if (this.cached[this.state.base] !== undefined && Date.now() - this.cached[this.state.base].timestamp < (1000 * 60)) {
            this.setState({
                converted: this.cached[this.state.base].rates[this.state.other] * value
            });
            return;
        }

        fetch(`https://api.exchangeratesapi.io/latest?base=${this.state.base}`)   
        .then(response => response.json())
        .then(data => {
            this.cached[this.state.base] = {
                rates: data.rates,
                timestamp: Date.now()
            };
            this.setState({
                converted: data.rates[this.state.other] * value
            });
        });
    }
}

export default App;
