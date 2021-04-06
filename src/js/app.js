import React, { Component } from 'react';
//import { BrowserRouter as Router, Route, Link, NavLink  } from "react-router-dom";
import { Router, Route, Link, NavLink, Redirect  } from "react-router-dom";
import { createBrowserHistory } from 'history';

/* Styles */
import "../css/app.less";

/* Components */
import ServiceSchedule from './templates/serviceschedule';
import Home from './templates/home';
import Login from './templates/login';
import Admin from './templates/admin';

/* Images */
import logo_c from '../assets/imgs/logo_c1.png';
import logo_w from '../assets/imgs/logo_w.png';

var mySessKey = "g1lM0re";
const history = createBrowserHistory(); 

const routes = [
    { path:"/serviceschedule", component:ServiceSchedule }
];

const SiteRoutes = route => (
    <Route path={route.path} render={props => ( <route.component {...props} />)} />
);

function MobileNav(props){       
    return (
        <div className={"sidenav-container" + (props.sidebarOpen ? " active": "")}>
            <div className="nav-close" onClick={() => props.setSidebarDisplay(false)}><span className="close-nav" /></div>
            <div className="sidenav-section">
                <a className="sidenav-link" href="/#aboutus" onClick={() => props.setSidebarDisplay(false)}>About Us</a>
                <a className="sidenav-link" href="/#preparing" onClick={() => props.setSidebarDisplay(false)}>Preparing For A Funeral</a>
                <a className="sidenav-link" href="/#contactus" onClick={() => props.setSidebarDisplay(false)}>Contact Us</a>
                <NavLink className="sidenav-link" to="/serviceschedule" onClick={() => props.setSidebarDisplay(false)}>Service Schedule</NavLink>                
            </div>

            <div className="sidenav-section title">
                <h1 className="sidenav-title">Roy L. Gilmore Funeral Home Inc.</h1>
                <p>(718) 529-3030</p>
            </div>
        </div>
    );
}

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false,
            copyrightDate:"2021",
            pageLoc:""
        };
        this.setSidebarDisplay = this.setSidebarDisplay.bind(this);
        this.changePageLoc = this.changePageLoc.bind(this);
        this.userHandler = this.userHandler.bind(this);
        this.checkUser = this.checkUser.bind(this);
    }

    setSidebarDisplay(status) {
        this.setState({ sidebarOpen: status }, () =>{
            document.body.classList.toggle('noscroll', status);
        });
    }

    changePageLoc(page){
        this.setState({ pageLoc:page });
    }

    userHandler(newToken, cb){
        try {   
            if(newToken){            
                localStorage.setItem(mySessKey, newToken);
                uAuth.authenticate(cb);
            }
            else {
                localStorage.removeItem(mySessKey);
                cb();
            }              
        }
        catch(ex){
            console.log("Error with user handler: ", ex);
        }
    }

    checkUser(){
        try {
            var sessionInfo = localStorage.getItem(mySessKey);
            if(sessionInfo){
                var { isExpired } = parseToken(sessionInfo); 
                
                if(isExpired) {
                    this.userHandler(null, function(){});
                }
            }
        }
        catch(ex){
            console.log("Error Check Active User: ",ex);
        }
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
            this.checkUser();
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
                                <NavLink className="nav-item nav-link" to="/serviceschedule" activeClassName="selected">Service Schedule</NavLink>
                                <a className={"nav-item nav-link" + (this.state.pageLoc === "contactus"? " selected":"")} href="/#contactus">Contact Us</a>
                            </div>
                        </div>
                    </nav>

                    {/* Body */}                    
                    <Route exact path="/" render={props => ( <Home {...props} changePageLoc={this.changePageLoc}/>)} />
                    { routes.map((route, i) => <SiteRoutes key={i} {...route} changePageLoc={this.changePageLoc} />) }

                    {/* Admin Page */}
                    <Route exact path="/login" render={props => ( <Login {...props} userHandler={this.userHandler} mySessKey={mySessKey} />)} />
                    <PrivateRoute path="/admin"><Admin userHandler={this.userHandler} /></PrivateRoute>

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

/* Private Route */

const uAuth = {
    isAuthenticated: false,
    checkUser() {
        //var ret = true;
        var ret = false;
        try {
            var sessionInfo = localStorage.getItem(mySessKey);
            if(sessionInfo){
                var { localUser } = parseToken(sessionInfo);
                ret = (localUser._id ? true : false);
            }
        }
        catch(ex){
            console.log(" [Error] uAuth check: ",ex);
        }
        uAuth.isAuthenticated = ret;
        return ret;
    },
    authenticate(cb) {
        uAuth.isAuthenticated = true;
        cb();
    },
    signout() {
        uAuth.isAuthenticated = false;
    }
};

function PrivateRoute({ children, ...rest }) {
    var authChk = uAuth.checkUser();
    return (
      <Route {...rest} render={({ location }) =>
            authChk ? (children) 
            : ( <Redirect to={{ pathname: "/login", state: { from: location } }}/> )
        }/>
    );
}

function parseToken(token){
    var localUser = null, isExpired = true; 
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        var jsStr = window.atob(base64);

        localUser = JSON.parse(jsStr);
        isExpired = (localUser && localUser.expDt < Date.now());
    }
    catch(ex){
        console.log("[Error] parsing token: ",ex);
    }

    return { localUser, isExpired }
}