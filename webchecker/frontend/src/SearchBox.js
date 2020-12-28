import React, { Component } from 'react'

export default class SearchBox extends Component {
    constructor() {
        super();
        this.state = {
            domain: '',
            error: false
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.search = this.search.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.search();
            e.preventDefault();
        }

      }
    search = () => {
        const domain = this.state.domain;
        const flag = !domain || (domain && (domain.indexOf('https://') >= 0 || domain.indexOf('http://') >= 0));
        if (flag) {
            this.setState({ error: true })
        } else {
            this.props.onCrawl(domain);
            this.setState({ error: false });
        }

    }
    handleChange = (event) => {
        this.setState({ domain: event.target.value });
    }
    render() {
        return (
            <div className="jumbotron text-center">
                <h1>Enter the domain to search</h1>
                <form className="form-inline">
                    <div className="input-group">
                        <input id="url" size={100} placeholder="Domain name" onKeyDown={this.handleKeyDown} onChange={this.handleChange} value={this.state.domain} required="required" className="form-control" />
                        <div className="input-group-btn"><button id="generateLinks" type="button" onClick={this.search} className="btn btn-danger">Check</button></div>
                    </div>
        {(this.props.errorMessage || this.state.error) && <div id="errorMessage" role="alert" className="alert alert-danger">{this.props.errorMessage || 'Enter a nacked domain(without https:// or http://)'}</div>}
                    <div id="placeholder" />
                </form>
            </div>
        )
    }
}
