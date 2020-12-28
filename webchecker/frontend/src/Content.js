import React, { Component } from 'react';
import SearchBox from './SearchBox';
import { postData, getData } from './common'
import Details from './Details';
import Loader from './Loader';
import { Redirect } from "react-router-dom";

export default class Content extends Component {
    constructor() {
        super();
        this.state = { loading: false, serverError: '', domainId: 0, domains: [] }
        this.crawl = this.crawl.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.showModel = this.showModel.bind(this);
        this.hideModel = this.hideModel.bind(this);
        this.deleteDomain = this.deleteDomain.bind(this);
        this.clearDetail = this.clearDetail.bind(this);
    }

    clearDetail() {
        this.setState({ domainId: 0, contact: false });
    }
    setLoading(show) {
        this.setState({ loading: show });
    }

    async crawl(domain) {
        try {
            this.clearDetail();
            this.setLoading(true);
            const result = await postData('/crawler', { domain: domain });
            try {
                await this.loadData();
                this.setLoading(false);
            } catch (ex) {
                this.setLoading(false);
            }
            if(result && result.domain && result.domain.domainId){
                this.showModel(result.domain.domainId, result.domain.domainName, false);
            }
            this.setState({ serverError: null });
        } catch (ex) {
            this.setState({ serverError: "Error happened while processing" });
            this.setLoading(false);
        }
    }
    async deleteDomain(domainId) {
        try {
            this.setLoading(true);
            const result = await postData(`/domains/${domainId}/delete`);
            try {
                await this.loadData();
                this.setLoading(false);
            } catch (ex) {
                this.setLoading(false);
            }
            this.setState({ serverError: null });
        } catch (ex) {
            this.setState({ serverError: "Error happened while processing" });
            this.setLoading(false);
        }
    }
    componentDidMount() {
        this.loadData();
    }
    async loadData() {
        try {
            this.setLoading(true);
            const domains = await getData('/domains');
            this.setState({ domains: domains });
            this.setLoading(false);
        } catch (ex) {
            this.setState({ serverError: "Error happened while processing" });
            this.setLoading(false);
        }
    }

    showModel(id, domain, contact) {
        if(contact){
            this.props.history.push(`/${domain}/contact`)
        }else{
            this.props.history.push(`/${domain}`)
        }
    }

    hideModel() {
        this.setState({ domainId: null });
    }
    render() {
        return (
            <React.Fragment>
                <Loader loading={this.state.loading}></Loader>
                <SearchBox errorMessage={this.state.serverError} onCrawl={this.crawl}></SearchBox>
                <div id="about" className="container-fluid bg-grey">
                    <div className="row">
                        <div className="col-sm-12">
                            {this.state.domainId <= 0 && <React.Fragment>
                                <h1>Domain data</h1>
                                <table className="table website-table-data">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '5%' }}> </th>
                                            <th style={{ width: '10%' }}>Website Id</th>
                                            <th style={{ width: '30%' }}>Domain </th>
                                            <th style={{ width: '15%' }} />
                                            <th style={{ width: '15%' }} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.domains && this.state.domains.map(c => <tr key={c.domain_id}>
                                            <td> <a className="remove" onClick={() => { this.deleteDomain(c.domain_id) }}><span aria-hidden="true" title="Delete domain" className="glyphicon glyphicon-remove-circle i-color" /></a></td>
                                            <td className="website-id">{c.domain_id}</td>
                                            <td>{c.domain}</td>
                                            <td><a onClick={() => { this.showModel(c.domain_id, c.domain) }} className="copy i-color">View details <span aria-hidden="true" title="View details" className="glyphicon glyphicon-copy" /></a></td>
                                            <td><a onClick={() => { this.showModel(c.domain_id, c.domain, true) }} className="copy i-color">View contact details <span aria-hidden="true" title="View details" className="glyphicon glyphicon-copy" /></a></td>
                                        </tr>)}

                                    </tbody>
                                </table>
                            </React.Fragment>}
                            {this.state.domainId > 0 && <Details domainId={this.state.domainId} contact={this.state.contact} backToList={this.clearDetail} domain={this.state.domain} hideModel={this.hideModel}></Details>}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
