import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink  } from "react-router-dom";
import { createBrowserHistory } from 'history';

/* Styles */
import "../css/app.less";

/* Components */
import UC from './templates/uc';
import Home from './templates/home';

/* Images */
import logo_c from '../assets/imgs/logo_c1.png';
import logo_w from '../assets/imgs/logo_w.png';

const history = createBrowserHistory(); 

const routes = [
    { path:"/Obituaries", component:UC}
];

const SiteRoutes = route => (
    <Route path={route.path} render={props => ( <route.component {...props} />)} />
);

function MobileNav(props){       
    return (
        <div className={"sidenav-container" + (props.sidebarOpen ? " active": "")}>
            <div className="nav-close" onClick={() => props.setSidebarDisplay(false)}><span className="close-nav" /></div>
            <div className="sidenav-section">
                <a className="sidenav-link" href="/#aboutus">About Us</a>
                <a className="sidenav-link" href="/#preparing">Preparing For A Funeral</a>
                <NavLink className="sidenav-link" to="/obituaries">Obituaries</NavLink>
                <a className="sidenav-link" href="/#contactus">Contact Us</a>
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
            sidebarOpen: false,
            copyrightDate:"2020",
            pageLoc:""
        };
        this.setSidebarDisplay = this.setSidebarDisplay.bind(this);
        this.changePageLoc = this.changePageLoc.bind(this);
    }

    setSidebarDisplay(status) {
        this.setState({ sidebarOpen: status }, () =>{
            document.body.classList.toggle('noscroll', status);
        });
    }

    changePageLoc(page){
        this.setState({ pageLoc:page });
    }

    componentDidMount(){
        var self = this;
        try {
            window.addEventListener('scroll', function(){
                var scrollPg = document.getElementById("scroll-page");
                if(!scrollPg){
                    self.changePageLoc("");
                }
            });
        }
        catch(ex){
            console.log("[Error] checking scroll loc: ", ex);
        }
    }

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
                                <a className={"nav-item nav-link" + (this.state.pageLoc === "aboutus"? " selected":"")} href="/#aboutus" >About Us</a>
                                <a className={"nav-item nav-link" + (this.state.pageLoc === "preparing"? " selected":"")} href="/#preparing">Preparing For A Funeral</a>
                            </div>
                           
                            <div className="navbar-nav ml-auto nav-right">
                                <NavLink className="nav-item nav-link" to="/obituaries" activeClassName="selected">Obituaries</NavLink>
                                <a className={"nav-item nav-link" + (this.state.pageLoc === "contactus"? " selected":"")} href="/#contactus">Contact Us</a>
                            </div>
                        </div>
                    </nav>

                    {/* Body */}                    
                    <Route exact path="/" render={props => ( <Home {...props} changePageLoc={this.changePageLoc}/>)} />
                    {/*<Route exact path="/" component={Home} />*/}
                    { routes.map((route, i) => <SiteRoutes key={i} {...route} changePageLoc={this.changePageLoc} />) }
                    
                    {/* Footer */}
                    <div className="footer">
                        <div className="footer-section logo-section">
                            <img src={logo_w} alt="Gilmore Funeral Home Crest"/>
                            <div className="logo-text">
                                <div>Roy L. Gilmore</div>
                                <div>Funeral Home, Inc.</div>
                            </div>
                        </div>
                        <div className="footer-section icon-section">
                            <i className="fas fa-phone"/>
                            <span>(718) 529-3030</span>
                        </div>
                        <div className="footer-section icon-section">
                            <i className="far fa-copyright"/>
                            <span>{this.state.copyrightDate}. Roy L. Gilmore Funeral Home Inc. All Rights Reserved.</span>
                        </div>
                    </div>
                </div>
            </Router>
        )
    }    
}
export default App;