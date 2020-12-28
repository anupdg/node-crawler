import React, { Component } from 'react'
import Loader from './Loader';
import { getData } from './common'
import { Redirect } from "react-router-dom";

export default class Details extends Component {
    constructor() {
        super();
        this.state = { loading: false }
        this.setLoading = this.setLoading.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadContactData = this.loadContactData.bind(this);
        this.geoKeys = { 'registrar': 'Name of the registrar', 'asn': 'ASN', 'city': 'City', 'region': 'Region', 'country': 'Country', 'ip': 'IP Address', 'name_server': 'Name Servers', 'creation_date': 'Domain Creation Date', 'updated_date': 'Domain Updated Date' }
        this.sslKeys = { 'ocsp_uri': 'OCSP Uri', 'ca_issuers_uri': 'CA Issuers Uri', 'valid_from': 'Valid from', 'valid_to': 'Valid to' };
        this.whoKeys = { 'registrant_organization': 'Name', 'creation_date': 'First Registration Date', 'updated_date': 'Last Change Date' };
        this.socialKeys = { 'nodata': '', 'facebook': 'Facebook', 'twitter': 'Twitter', 'instagram': 'Instagram' };
        this.linksKey = { 'privacy': 'Privacy Policy Url', 'terms': 'Term and Services Url' };
    }
    setLoading(show) {
        this.setState({ loading: show });
    }

    async loadData(domainName) {
        try {
            this.setLoading(true);
            const details = await getData(`/domains/${domainName}`);
            if (details && details.geoData && details.geoData.name_server) {
                details.geoData.name_server = details.geoData.name_server.split(',').join(', ');
            }
            this.setState({ details: details });
            this.setLoading(false);
        } catch (ex) {
            this.setState({ serverError: "Error happened while processing" });
            this.setLoading(false);
        }
    }
    async loadContactData(domainName) {
        try {
            this.setLoading(true);
            const contact = await getData(`/domains/${domainName}/contact`);
            this.setState({ contactus: contact.contact_us });
            this.setLoading(false);
        } catch (ex) {
            this.setState({ serverError: "Error happened while processing" });
            this.setLoading(false);
        }
    }
    async componentDidMount() {
        const { match: { params } } = this.props;
        if (params) {
            this.setState({ contact: params.contact, domainName: params.domainName }, function () {
                if (params.contact) {
                    this.loadContactData(params.domainName);
                } else {
                    this.loadData(params.domainName);
                }
            });
        }
    }
    render() {
        if (this.state.backToList) {
            return <Redirect to='/' />
        }
        return (
            <div id="about" className="container-fluid bg-grey m-t5">
                <div className="row">
                    <div className="col-sm-12">
                        <Loader loading={this.state.loading}></Loader>
                        <h1 className="modal-title f-l">{this.state.contact ? 'Contact ' : ''} Details for {this.state.domainName}</h1><a className="f-r b-link" onClick={() => { this.setState({ backToList: true }) }}>Back to list</a>
                        <div className="bd-details cl-fix">
                            {!this.state.contact && <React.Fragment>
                                {this.state.details && this.state.details.geoData && <div className="card">
                                    <div className="card-header">Geo-location details</div>
                                    <div className="card-body">
                                        {this.geoKeys && Object.keys(this.geoKeys).map(g => <dl key={g}>
                                            <dt>{this.geoKeys[g]}</dt>
                                            <dd>{this.state.details.geoData[g] || 'No data found'}</dd>
                                        </dl>)}
                                    </div>
                                </div>}
                                {this.state.details && this.state.details.sslData && <div className="card mt-1">
                                    <div className="card-header">SSL details</div>
                                    <div className="card-body">
                                        {this.sslKeys && Object.keys(this.sslKeys).map(g => <dl key={g}>
                                            <dt>{this.sslKeys[g]}</dt>
                                            <dd>{this.state.details.sslData[g] || 'No data found'}</dd>
                                        </dl>)}
                                    </div>
                                </div>}
                                {this.state.details && this.state.details.whoData && <div className="card mt-1">
                                    <div className="card-header">Whois details</div>
                                    <div className="card-body">
                                        {this.whoKeys && Object.keys(this.whoKeys).map(g => <dl key={g}>
                                            <dt>{this.whoKeys[g]}</dt>
                                            <dd>{this.state.details.whoData[g] || 'No data found'}</dd>
                                        </dl>)}
                                    </div>
                                </div>}
                                {this.state.details && this.state.details.socialData && <div className="card mt-1">
                                    <div className="card-header">Social details</div>
                                    <div className="card-body">
                                        {this.socialKeys && Object.keys(this.socialKeys).map(g => <React.Fragment>{this.state.details.socialData[g] && <dl key={g}>
                                            <dt>{this.socialKeys[g]}</dt>
                                            <dd>{this.state.details.socialData[g]}</dd>
                                        </dl>}</React.Fragment>)}
                                    </div>
                                </div>}
                                {this.state.details && this.state.details.linksData && <div className="card mt-1">
                                    <div className="card-header">Privacy and Terms urls</div>
                                    <div className="card-body">
                                        {this.linksKey && Object.keys(this.linksKey).map(g => <dl key={g}>
                                            <dt>{this.linksKey[g]}</dt>
                                            <dd>{this.state.details.linksData[g] || 'No data found'}</dd>
                                        </dl>)}
                                    </div>
                                </div>}
                            </React.Fragment>}
                            {this.state.contact && <div className="card">
                                <div className="card-header">Contact us details</div>
                                {this.state.contactus && <div className="card-body">
                                    {this.state.contactus.length > 0 && this.state.contactus.map(c => <React.Fragment>{c} <br /></React.Fragment>)}
                                </div>}
                                {!this.state.contactus && <div className="card-body">No contact details found</div>}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
