import React, { Component } from 'react';
import validator from 'validator';
// validator.isEmail(email)

/* Images */
import logo_w from '../../assets/imgs/logo_w.png';

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            page: "signin",
            email:"",
            password:"",
            tmpPassword:"",
            newPassword1:"",
            newPassword2: ""
        }   
        
        this.checkParams = this.checkParams.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }  

    checkParams(){
        try {
            /* Page Types 
                signin : default signin form
                forgot : forgot password email form
                reset  : reset password form
            */
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

    componentDidMount(){ 
        this.checkParams();
    }

    render(){  
        return(
            <div className="page-body login background-pattern1">
                <div className="login-container">
                    <div className="login-form">
                        <h1>Sign-in</h1>
                        <div className="input-field">
                            <div className="input-title">Email</div>
                            <div className={"input-container" + (this.state.email.length > 0 && !validator.isEmail(this.state.email) ? " error": "")}>
                                <i className="far fa-envelope"></i>
                                <input type="text" name="email" onChange={this.handleChange}/>
                            </div>
                        </div>

                        {this.state.page === "signin" &&
                            <div className="sub-content signin">
                                <div className="input-field">
                                    <div className="input-title">Password</div>
                                    <div className="input-container">
                                        <i className="fas fa-lock"></i>
                                        <input type="password" name="password" autoComplete="off" onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="sign-in-btn">Sign-in</div>
                                <div className="forgot-link" onClick={()=> this.setState({ page: "forgot" })}>Forgot Password?</div>
                            </div>
                        }

                        {this.state.page === "forgot" &&
                            <div className="sub-content forgot">
                                <div className="sign-in-btn">Send Forgot Email</div>
                                <div className="forgot-link" onClick={()=> this.setState({ page: "signin" })}>Cancel</div>
                            </div>
                        }

                        {this.state.page === "reset" &&
                            <div className="sub-content reset">
                                <div className="input-field">
                                    <div className="input-title">Temporary Password</div>
                                    <div className="input-container">
                                        <i className="fas fa-lock-open"></i>
                                        <input type="password" name="tmpPassword" autoComplete="off" onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="input-field">
                                    <div className="input-title">New Password</div>
                                    <div className="input-container">
                                        <i className="fas fa-lock"></i>
                                        <input type="password" name="newPassword1" autoComplete="off" onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="input-field">
                                    <div className="input-title">Confirm Password</div>
                                    <div className="input-container">
                                        <i className="fas fa-lock"></i>
                                        <input type="password" name="newPassword2" autoComplete="off" onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="sign-in-btn">Reset Password</div>
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