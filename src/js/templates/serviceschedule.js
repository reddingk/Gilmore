import React, { Component } from 'react';
import axios from 'axios';

var rootPath = ( true ? "http://localhost:1245" : "");

class ServiceSchedule extends Component{
    constructor(props) {
        super(props);
        this.state = {
            search:"",
            pageCount:1,
            currentPg:1,
            serviceList:[
                { name:"Joe Smith", location:"Chapel A", date:"2020-11-20T17:00:00" },
                { name:"Betty Wilson", location:"Chapel B", date:"2020-11-20T16:00:00" },
                { name:"AJ Rodger", location:"Chapel C", date:"2020-11-22T14:00:00" },
                { name:"Kathrine Jensah", location:"Chapel B", date:"2020-11-24T12:00:00" },
                { name:"Thomas Hamilton", location:"Chapel D", date:"2020-11-25T16:30:00" }
            ]
        }
        
        /* Functions */
        this.getServiceList = this.getServiceList.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.onElementChange = this.onElementChange.bind(this);
        this.pageChange = this.pageChange.bind(this);
    }  

    getServiceList(search, page){
        var self = this;
        try {
            var postData = { search:search, size:8, page:page };
            axios.post(rootPath + "/api/getServices", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        console.log(" [Error] Getting Service List(1): ", response.data.errorMessage);
                    }
                    else if(response.data.results.list && response.data.results.list.length >= 0){
                        self.setState({ serviceList: response.data.results.list, pageCount: response.data.results.pageCount });
                    }
                }); 
        }
        catch(ex){
            console.log(" [Error] Getting Service List: ",ex);
        }
    }

    parseDate(stdate, type){
        var ret = null;
        var Month = ["January", "February", "March","April","May","June","July","August","September","October","November","December"];

        try {
            var date = new Date(stdate);
            switch(type){
                case "time":
                    ret = ((date.getHours() +1 > 12) ? (date.getHours()+1) -12 : (date.getHours()+1)) +":"
                    + ((date.getMinutes() < 10) ? "0"+ date.getMinutes() : date.getMinutes())
                    + ((date.getHours() +1 > 12) ? " PM" : " AM");
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

    onElementChange(event){
        var self = this;
        try {
            var name = event.target.name;

            if(name in this.state) {
                self.setState({ [name]: event.target.value, currentPg:1 }, () =>{
                    self.getServiceList(self.state.search, self.state.currentPg);
                });
            }
        }
        catch(ex){
            console.log("[ERROR] on element change: ",ex);
        }
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

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.getServiceList("", 1);
    }

    render(){  
        return(
            <div className="page-body services">
                <section className="sub-header">
                    <div className="header-container">
                        <div className="sub-content sub-title">
                            <h1>Service<br />Schedule</h1>
                        </div>
                        <div className="sub-content sub-text">
                            <p>A tradition passed on from generation to generation, the Gilmore family has dedicated their lives to serving families in their time of need. Our Service Schedule tool can be used to help you find more information about your loved ones service. </p>
                        </div>
                    </div>
                </section>
                <section className="service-list">
                    <div className="list-header">
                        <h1>Services</h1>
                        <div className="search-container">
                            <div className="search-field">
                                <i className="fas fa-search" />
                                <input type="text" name="search" placeholder="Search Name" onChange={(e) => this.onElementChange(e)}/>
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
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.serviceList.map((service, i) => (
                                <tr key={i}>
                                    <td>{service.name}</td>
                                    <td>{this.parseDate(service.date,"date")}</td>
                                    <td>{this.parseDate(service.date,"time")}</td>
                                    <td>{service.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="table-control">
                        <div className="scroll-ctrl">
                            <div className={"ctrl-item left" + (this.state.currentPg === 1 ? " disabled":"")} onClick={() => this.pageChange("prev")}><i className="fas fa-chevron-left"/></div>
                            <div className={"ctrl-item right" + (this.state.currentPg === this.state.pageCount ? " disabled":"")} onClick={() => this.pageChange("next")}><i className="fas fa-chevron-right"/></div>
                        </div>

                        <div className="page-info">
                            <div className="pg-info">Page {this.state.currentPg} of {this.state.pageCount}</div>                            
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
export default ServiceSchedule;