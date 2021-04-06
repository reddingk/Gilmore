import React, { Component } from 'react';
import axios from 'axios';
import validator from 'validator';

import LoadSpinner from '../components/loadSpinner';

/* Images */
import logo_w from '../../assets/imgs/logo_w.png';

const baseUrl = (window.location.href.indexOf("localhost") > -1 ? "http://localhost:1245" : "");

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            page: "signin",
            email:"",
            password:"",
            tmpPassword:"",
            newPassword1:"",
            newPassword2: ""
        }   
        
        this.checkParams = this.checkParams.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.forgotPwd = this.forgotPwd.bind(this);
        this.resetPwd = this.resetPwd.bind(this);
        this.signin = this.signin.bind(this);
        this.checkUser = this.checkUser.bind(this);
    }  

    checkParams(){
        try {
            /* Page Types 
                signin : default signin form
                forgot : forgot password email form
                reset  : reset password form
            */
            let params = new URLSearchParams(this.props.location.search);
            if(params.has("resetCode")){
                this.setState({ page: "reset", tmpPassword: params.get("resetCode") });
            }
        }
        catch(ex){
            console.log("Error Check Page Params: ",ex);
        }
    }

    handleChange(e){
        try {
            var name = e.target.name;
            var value = e.target.value;
            
            this.setState({ [name]: value });
        }
        catch(ex){
            console.log(" [Error] Handling Change: ",ex);
        }
    }

    forgotPwd(){
        var self = this;
        try {
            if(!validator.isEmail(this.state.email)) {
                alert("Please Enter In A Valid Email Address!");
            }
            else {
                this.setState({ loading:true }, () => {    
                    var postData = {"email":self.state.email };
                    axios.post(baseUrl + "/api/auth/forgotPassword", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        self.setState({loading: false},()=>{
                            if(response.data.error){
                                console.log("[Error] Forgot Password: ", response.data.error);
                                alert("Error With Forgot Password Tool, Please Contact Site Admin!");
                            }
                            else {
                                alert("Temporary Email has been sent please open email and follow the steps provided.")
                            }
                        });
                    });
                });
            }
        }
        catch(ex){
            console.log(" [Error] With Forgot Password: ",ex);
        }
    }

    resetPwd(){
        var self = this;
        try {
            if(!validator.isEmail(this.state.email)) {
                alert("Please Enter In A Valid Email Address!");
            }
            else if(this.state.newPassword1 !== this.state.newPassword2){
                alert("Passwords Do Not Match");
            }
            else {
                this.setState({ loading:true }, () => {    
                    var postData = {"email":self.state.email, tmpPassword: this.state.tmpPassword, password: this.state.newPassword1 };
                    axios.post(baseUrl + "/api/auth/resetPassword", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        self.setState({loading: false},()=>{
                            if(response.data.error || !response.data.results){
                                console.log("[Error] Resetting Password: ", response.data.error);
                                alert("Error With Resetting Tool, Please Contact Site Admin!");
                            }
                            else {
                                self.setState({ page: "signin"},()=>{
                                    alert("Password has been successfully reset, please sign-in");
                                });
                            }
                        });
                    });
                });
            }
        }
        catch(ex){
            console.log(" [Error] Resetting Password: ",ex);
        }
    }

    signin(){
        var self = this;
        try {
            if(!validator.isEmail(this.state.email)) {
                alert("Please Enter In A Valid Email Address!");
            }
            else {
                this.setState({ loading:true }, () => {    
                    var postData = {"email":self.state.email, password: this.state.password };
                    axios.post(baseUrl + "/api/auth/login", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        self.setState({loading: false},()=>{
                            if(response.data.error){
                                console.log("[Error] With Sign-in: ", response.data.error);
                            }
                            else if(response.data.results.status === "temporary"){
                                self.setState({ page: "reset", tmpPassword: this.state.password, password: "" })
                            }
                            else {
                                self.props.userHandler(response.data.results.token, function(){
                                    self.props.history.push("/admin");
                                });
                            }
                        });
                    });
                });
            }
        }
        catch(ex){
            console.log(" [Error] With Forgot Password: ",ex);
        }
    }

    checkUser(){
        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);
            if(sessionInfo){
                var { isExpired } = parseToken(sessionInfo); 
                
                if(!isExpired) {
                    this.props.history.push("/admin");
                }
            }
        }
        catch(ex){
            console.log("Error Check Active User: ",ex);
        }
    }

    componentDidMount(){
        this.checkUser(); 
        this.checkParams();
    }

    render(){  
        return(
            <div className="page-body login background-pattern1">
                {this.state.loading && <LoadSpinner /> }
                <div className="login-container">
                    <div className="login-form">
                        <h1>Sign-in</h1>
                        <div className="input-field">
                            <div className="input-title">Email</div>
                            <div className={"input-container" + (this.state.email.length > 0 && !validator.isEmail(this.state.email) ? " error": "")}>
                                <i className="far fa-envelope"></i>
                                <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
                            </div>
                        </div>

                        {this.state.page === "signin" &&
                            <div className="sub-content signin">
                                <div className="input-field">
                                    <div className="input-title">Password</div>
                                    <div className="input-container">
                                        <i className="fas fa-lock"></i>
                                        <input type="password" name="password" value={this.state.password} autoComplete="off" onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="sign-in-btn" onClick={this.signin}>Sign-in</div>
                                <div className="forgot-link" onClick={()=> this.setState({ page: "forgot" })}>Forgot Password?</div>
                            </div>
                        }

                        {this.state.page === "forgot" &&
                            <div className="sub-content forgot">
                                <div className="sign-in-btn" onClick={this.forgotPwd}>Send Forgot Email</div>
                                <div className="forgot-link" onClick={()=> this.setState({ page: "signin" })}>Cancel</div>
                            </div>
                        }

                        {this.state.page === "reset" &&
                            <div className="sub-content reset">
                                <div className="input-field">
                                    <div className="input-title">Temporary Password</div>
                                    <div className="input-container uneditable">
                                        <i className="fas fa-lock-open"></i>
                                        <input type="password" name="tmpPassword" value={this.state.tmpPassword} autoComplete="off" onChange={this.handleChange} readOnly={true}/>
                                    </div>
                                </div>

                                <div className="input-field">
                                    <div className="input-title">New Password</div>
                                    <div className={"input-container" + (this.state.newPassword1 !== this.state.newPassword2 ? " error":"")}>
                                        <i className="fas fa-lock"></i>
                                        <input type="password" name="newPassword1" value={this.state.newPassword1} autoComplete="off" onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="input-field">
                                    <div className="input-title">Confirm Password</div>
                                    <div className={"input-container" + (this.state.newPassword1 !== this.state.newPassword2 ? " error":"")}>
                                        <i className="fas fa-lock"></i>
                                        <input type="password" name="newPassword2" value={this.state.newPassword2} autoComplete="off" onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="sign-in-btn" onClick={this.resetPwd}>Reset Password</div>
                                <div className="forgot-link" onClick={()=> this.setState({ page: "signin" })}>Cancel</div>
                            </div>
                        }
                    </div>

                    <div className="img-container">
                        <div className="img-text">
                            <h1>Welcome to the <span>Admin Portal</span></h1>
                            <p>Please sign-in using an authorized account to access website updator tool.</p>
                        </div>
                        <div className="sign-in-logo"><img src={logo_w} alt="Gilmore Funeral Home Crest"/></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;

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