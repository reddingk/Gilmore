import React, { Component } from 'react';
import axios from 'axios';
import ReactGA from 'react-ga';

import LoadSpinner from '../components/loadSpinner';

var rootPath = ( window.location.href.indexOf("localhost") > -1  ? "http://localhost:1245" : "");

class ServiceSchedule extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            search:"",
            pageCount:1,
            currentPg:1,
            serviceList:[]
        }
        
        /* Functions */
        this.getServiceList = this.getServiceList.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.onElementChange = this.onElementChange.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.initialReactGA = this.initialReactGA.bind(this);
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

    initialReactGA(){
        //ReactGA.initialize('');
        ReactGA.pageview('/serviceschedule');
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.initialReactGA();
        this.getServiceList("", 1);
    }

    render(){  
        document.title ="Roy L. Gilmore Funeral Home | Service Schedule"; 
        return(
            <div className="page-body services">
                {this.state.loading && <LoadSpinner /> }
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
                    <table className="service-table hover-row">
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
                            {this.state.serviceList.length === 0 &&
                                <tr className="empty-table"><td colSpan={4}>No Services Found</td></tr>
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
                </section>
            </div>
        );
    }
}
export default ServiceSchedule;