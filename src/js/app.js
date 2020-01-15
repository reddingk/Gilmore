import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from 'history';
import $ from 'jquery';

/* Images */
import logo_w from '../assets/imgs/logo_w.png';
import logo_b from '../assets/imgs/logo_b1.png';
import logo_c from '../assets/imgs/logo_c1.png';

/* Styles */
import "../css/app.less";

/* Components */
import UC from './templates/uc';
import Home from './templates/home';

const history = createBrowserHistory(); 

const routes = [
    { path:"/about", component:UC},
    { path:"/services", component:UC},
    { path:"/planning", component:UC},
    { path:"/contactUs", component:UC}
];
const SiteRoutes = route => (
    <Route path={route.path} render={props => ( <route.component {...props} />)} />
);


class App extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render(){    
        return( 
            <Router history={history}>
                <div className="gilmore-body">
                    {/* Header */}
                    <nav className="navbar navbar-expand-lg bg-dark">
                        <Link className="navbar-brand navbar-brand-centered" to="/">
                            <div className="initialLogo">
                                <div className="initial-wrapper">
                                    {/*<span className="initial1">G</span>*/}
                                    <img src={logo_c} />
                                </div>
                            </div>
                        </Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <div id="menuIcon" className="animateMenu">
                                <div className="bar1"></div>
                                <div className="bar2"></div>
                                <div className="bar3"></div>
                            </div>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav nav-left">
                                <Link className="nav-item nav-link" to="/about">About</Link>
                                <Link className="nav-item nav-link" to="/planning">Planning A Funeral</Link>
                            </div>

                            <div className="navbar-nav ml-auto nav-right">
                                <Link className="nav-item nav-link" to="/services">Services</Link>
                                <Link className="nav-item nav-link" to="/contactUs">Contact Us</Link>
                            </div>
                        </div>
                    </nav>

                    {/* Body */}
                    <Route exact path="/" component={Home} />
                    { routes.map((route, i) => <SiteRoutes key={i} {...route} />) }

                    {/* Footer */}
                    <div className="footer">
                        <div className="footer-section"></div>
                        <div className="footer-section"></div>
                        <div className="footer-section"></div>
                    </div>
                </div>                
            </Router>
        )
    }

    componentDidMount(){}
}
export default App;