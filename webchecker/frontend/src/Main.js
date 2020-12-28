import React from 'react'
import Header from './Header';
import Content from './Content';
import Details from './Details'
import Footer from './Footer';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


export default function Main() {
    return (<React.Fragment>
        <Header ></Header>
        <Router>
            <Switch>
                <Route path="/:domainName/:contact" component={Details}></Route>
                <Route path="/:domainName"  component={Details}></Route>
                <Route path="/"  component={Content}></Route>
            </Switch>
        </Router>
        <Footer></Footer>
    </React.Fragment>
    )
}
