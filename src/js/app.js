import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from 'history';

/* Styles */
import "../css/app.less";

/* Components */
import UC from './templates/uc';
import Home from './templates/home';

/* Images */
import logo_c from '../assets/imgs/logo_c1.png';

const history = createBrowserHistory(); 

const routes = [
    { path:"/contactUs", component:UC}
];

const SiteRoutes = route => (
    <Route path={route.path} render={props => ( <route.component {...props} />)} />
);

function MobileNav(props){       
    return (
        <div className={"sidenav-container" + (props.sidebarOpen ? " active": "")}>
            <div className="nav-close" onClick={() => props.setSidebarDisplay(false)}><span className="close-nav" /></div>
            <div className="sidenav-section">
                <a className="sidenav-link" href="#Aboutus">About Us</a>
                <a className="sidenav-link" href="#Preparing">Preparing For A Funeral</a>
                <a className="sidenav-link" href="#Obituaries">Obituaries</a>
                <a className="sidenav-link" href="#ContactUs">Contact Us</a>
            </div>

            <div className="sidenav-section title">
                <h1 className="sidenav-title">Roy L. Gilmore Funeral Home Inc.</h1>
            </div>
        </div>
    );
}

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false
        };
        this.setSidebarDisplay = this.setSidebarDisplay.bind(this);
    }

    setSidebarDisplay(status) {
        this.setState({ sidebarOpen: status }, () =>{
            document.body.classList.toggle('noscroll', status);
        });
    }

    componentDidMount(){}

    render(){    
        return( 
            <Router history={history}>
                <div className="gilmore-body">
                    {/* Header */}
                    <MobileNav setSidebarDisplay={this.setSidebarDisplay} sidebarOpen={this.state.sidebarOpen}/>
                    <nav className="navbar navbar-expand-lg bg-dark">
                        <Link className="navbar-brand navbar-brand-centered" to="/">
                            <div className="initialLogo">
                                <div className="initial-wrapper">
                                    <img src={logo_c} alt="Gilmore Funeral Home Crest"/>
                                </div>
                            </div>
                        </Link>
                        <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={() => this.setSidebarDisplay(true)}>
                            <span className="navbar-toggler-icon"><i className="fas fa-bars"></i></span>
                        </button>

                        <div className="collapse navbar-collapse">
                            <div className="navbar-nav nav-left">
                                <Link className="nav-item nav-link" to="/">About Us</Link>
                                <Link className="nav-item nav-link" to="/">Preparing For A Funeral</Link>
                            </div>
                           
                            <div className="navbar-nav ml-auto nav-right">
                                <Link className="nav-item nav-link" to="/">Obituaries</Link>
                                <Link className="nav-item nav-link" to="/">Contact Us</Link>
                            </div>
                        </div>
                    </nav>

                    {/* Body */}
                    <Route exact path="/" component={Home} />
                    { routes.map((route, i) => <SiteRoutes key={i} {...route} />) }
                    
                    {/* Footer */}
                    <div className="footer" />
                </div>
            </Router>
        )
    }    
}
export default App;