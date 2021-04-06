import React, { Component } from 'react';
import axios from 'axios';

import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";

import LoadSpinner from '../components/loadSpinner';

/* Images */
import logo_c from '../../assets/imgs/logo_b1.png';

var rootPath = ( window.location.href.indexOf("localhost") > -1  ? "http://localhost:1245" : "");

class Admin extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            locationList:["Chapel A","Chapel B","Chapel C","Chapel D" ],
            search:"", pageCount:1, currentPg:1,
            serviceList:[],
            name:"", date:'', location:"", _id:null 
        }  
        
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.getServiceList = this.getServiceList.bind(this);
        this.selectService = this.selectService.bind(this);
        this.clearSelected = this.clearSelected.bind(this);
        this.addUpdateService = this.addUpdateService.bind(this);
        this.removeService = this.removeService.bind(this);
    }  

    handleChange(e){
        var self = this;
        try {
            var name = e.target.name;
            var value = e.target.value;
            
            this.setState({ [name]: value },() => {
                if(name === "search") {
                    self.getServiceList(self.state.search, self.state.currentPg);
                }
            });
        }
        catch(ex){
            console.log(" [Error] Handling Change: ",ex);
        }
    }

    handleDateChange(e){
        try {
            var date = e._d;
            
            this.setState({ date: date });
        }
        catch(ex){
            console.log(" [Error] Handling Change: ",ex);
        }
    }

    parseDate(stdate, type){
        var ret = null;
        var Month = ["January", "February", "March","April","May","June","July","August","September","October","November","December"];

        try {
            var date = new Date(stdate);
            switch(type){
                case "time":
                    ret = ((date.getHours() > 12) ? (date.getHours() - 12) : date.getHours()) +":"
                    + ((date.getMinutes() < 10) ? "0"+ date.getMinutes() : date.getMinutes())
                    + ((date.getHours() > 12) ? " PM" : " AM");
                    break;
                case "date":
                    ret = Month[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
                    break;
                default:
                    ret = null;
                    break;
            }
        }
        catch(ex){
            console.log("Error parsing date: ", ex);
        }
        return ret;
    }

    pageChange(type){
        var self = this;
        try {
            if(type === "prev"){
                if(this.state.currentPg > 1){
                    this.setState({ currentPg: this.state.currentPg - 1}, () =>{
                        self.getServiceList(self.state.search, self.state.currentPg);
                    })
                }
            }
            else {
                if(this.state.currentPg < this.state.pageCount){
                    this.setState({ currentPg: this.state.currentPg + 1}, () =>{
                        self.getServiceList(self.state.search, self.state.currentPg);
                    });
                }
            }
        }
        catch(ex){
            console.log("[ERROR] page change: ",ex);
        }
    }

    getServiceList(search, page){
        var self = this;
        try {
            this.setState({ loading: true }, ()=>{
                var postData = { search:search, size:8, page:page };
                axios.post(rootPath + "/api/getServices", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.error){
                            console.log(" [Error] Getting Service List(1): ", response.data.error);
                            self.setState({loading:false});
                        }
                        else if(response.data.results.list && response.data.results.list.length >= 0){
                            self.setState({loading:false, serviceList: response.data.results.list, pageCount: response.data.results.pageCount });
                        }
                    }); 
            });
        }
        catch(ex){
            console.log(" [Error] Getting Service List: ",ex);
        }
    }

    selectService(service){
        try {
            this.setState({ 
                name:service.name, date:service.date, 
                location:service.location, _id:service._id
            });
        }
        catch(ex){
            console.log("[Error] Selecting Service")
        }
    }

    clearSelected(){
        try {
            this.setState({ name:"", date:'',  location:"", _id: null });
        }
        catch(ex){
            console.log("[Error] Clear Selected")
        }
    }

    addUpdateService(){
        var self = this;
        try {
            this.setState({ loading: true }, ()=> {

                var sessionInfo = localStorage.getItem(self.props.mySessKey);
                var getHeaders = { 'Content-Type': 'application/json', 'Authorization': sessionInfo };
                var postData = { _id: this.state._id, name: this.state.name, location: this.state.location, date: this.state.date };
                
                axios.post(rootPath + "/api/auth/updateService", postData, { headers: getHeaders })
                    .then(function(response) {
                        if(response.data.error || !response.data.results){
                            console.log(" [Error] Updating Service: ", response.data.error);
                            self.setState({loading:false});
                        }
                        else {
                            self.setState({ loading:false, name:"", date:'',  location:"", _id: null }, ()=>{
                                self.getServiceList(self.state.search, 1);
                            });
                        }
                    }); 
            });
        }
        catch(ex){
            console.log("[Error] Clear Selected")
        }
    }

    removeService(id){
        var self = this;
        try {
            var firm = window.confirm("Do you want to remove this service?");

            if(firm === true){ 
                this.setState({ loading: true }, ()=> {
                    var sessionInfo = localStorage.getItem(self.props.mySessKey);
                    var getHeaders = { 'Content-Type': 'application/json', 'Authorization': sessionInfo };
                    var postData = { id: id };
                    
                    axios.post(rootPath + "/api/auth/removeService", postData, { headers: getHeaders })
                        .then(function(response) {
                            if(response.data.error || !response.data.results){
                                console.log(" [Error] Updating Service: ", response.data.error);
                                self.setState({loading:false});
                            }
                            else {
                                self.getServiceList(self.state.search, 1);                            
                            }
                        }); 
                });
            }
        }
        catch(ex){
            console.log("[Error] Clear Selected")
        }
    }

    componentDidMount(){
        this.getServiceList("", 1);
    }

    render(){  
        return(
            <div className="page-body admin">
                {this.state.loading && <LoadSpinner /> }
                <div className="title">
                    <img src={logo_c} alt="Gilmore Funeral Home Crest"/>
                    <h1>Service Updator Tool</h1>
                </div>

                <div className="add-btn-container">
                    <div className="icon-container">
                        <div className="add-icon"><i className={"fas " + (this.state._id ? "fa-edit" :"fa-user-plus")} /></div>
                    </div>

                    <div className="input-field sz-3">
                        <div className="input-title">Name</div>
                        <div className="input-container">
                            <i className="fas fa-signature"></i>
                            <input type="text" name="name" value={this.state.name} autoComplete="off" onChange={this.handleChange}/>
                        </div>
                    </div>

                    <div className="input-field sz-2">
                        <div className="input-title">Location</div>
                        <div className="input-container">
                            <i className="fas fa-map-pin"></i>
                            <select name="location" value={this.state.location} onChange={this.handleChange}>
                                <option value=""></option>
                                {this.state.locationList.map((item,i) =>
                                    <option value={item} key={i}>{item}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="input-field sz-3">
                        <div className="input-title">Date & Time</div>
                        <div className="input-container">
                            <i className="fas fa-calendar-alt"></i>
                            <Datetime value={this.state.date} onChange={this.handleDateChange} displayTimeZone={null}/>
                        </div>
                    </div>

                    <div className="input-field btn-container sz-2">
                        <div className="lBtn" onClick={this.clearSelected}><span>Clear</span><i className="btn-icon fas fa-ban"></i></div>
                        <div className="lBtn" onClick={this.addUpdateService}><span>{this.state._id ? "Update" : "Add"}</span><i className="btn-icon fas fa-plus"></i></div>
                    </div>
                </div>

                <div className="service-list admin-list">
                    <div className="list-header">
                        <div className="search-container">
                            <div className="search-field c-blk">
                                <i className="fas fa-search" />
                                <input type="text" name="search" placeholder="Search Name" onChange={this.handleChange}/>
                            </div>
                        </div>
                    </div>
                    <table className="service-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date of Service</th>
                                <th>Service Time</th>
                                <th>Service Location</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.serviceList.map((service, i) => (
                                <tr key={i} className={(service._id === this.state._id ? "sel":"")}>
                                    <td>{service.name}</td>
                                    <td>{this.parseDate(service.date,"date")}</td>
                                    <td>{this.parseDate(service.date,"time")}</td>
                                    <td>{service.location}</td>
                                    <td>
                                        <div className="mini-btn-container">
                                            <div className="view-btn edit" onClick={() => this.selectService(service)}><i className="fas fa-edit"/></div>
                                            <div className="view-btn remove" onClick={()=> this.removeService(service._id)}><i className="fas fa-trash-alt" /></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {this.state.serviceList.length === 0 &&
                                <tr className="empty-table"><td colSpan={5}>No Services Found</td></tr>
                            }
                        </tbody>
                    </table>

                    {this.state.serviceList.length > 0 &&
                        <div className="table-control">
                            <div className="scroll-ctrl">
                                <div className={"ctrl-item left" + (this.state.currentPg === 1 ? " disabled":"")} onClick={() => this.pageChange("prev")}><i className="fas fa-chevron-left"/></div>
                                <div className={"ctrl-item right" + (this.state.currentPg === this.state.pageCount ? " disabled":"")} onClick={() => this.pageChange("next")}><i className="fas fa-chevron-right"/></div>
                            </div>

                            <div className="page-info">
                                <div className="pg-info">Page {this.state.currentPg} of {this.state.pageCount}</div>                            
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
export default Admin;