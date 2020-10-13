import React, { Component } from 'react';

import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from 'react-alice-carousel';

/* Images */
import back from '../../assets/imgs/back1.jpg';
//import back2 from '../../assets/imgs/base/IMG-1926.JPG';

/* Components */
import Signature from '../components/signature';

class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
            prePause:700,
            typePause:50,
            selectedIndex: 0,
            selectedPhrase:[],
            signature:false,
            introTitle:"",
            introPhrase:[
                { text:"As a family owned business, it is our distinct privilege to be able to provide information and services to those we serve with understanding.", class:"base"},
                { text:"Thank you kindly for your time,", class:"base line"}
            ],
            responsive: {
                0: { items: 1 },
                600: { items: 2 },
                1024: { items: 2 }
            },
            serviceList:[
                { name:"Joe Smith", location:"Room 101", date:"2020-11-20T17:00:00" },
                { name:"Betty Wilson", location:"Room 102", date:"2020-11-20T16:00:00" },
                { name:"AJ Rodger", location:"Room 103", date:"2020-11-22T14:00:00" },
                { name:"Kathrine Jensah", location:"Room 102", date:"2020-11-24T12:00:00" },
                { name:"Thomas Hamilton", location:"Room 103", date:"2020-11-25T16:30:00" }
            ]
        }
        
        this.buildEventItems = this.buildEventItems.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.phraseWriter = this.phraseWriter.bind(this);
        this.typePhrase = this.typePhrase.bind(this);
    }  
    
    buildEventItems() {
        return (
            this.state.serviceList.map((service, i) => ( 
                <div className="service-item">
                    <div className="service-date">
                        <div className="date-month">{this.parseDate(service.date,"month")}</div>
                        <div className="date-day">{this.parseDate(service.date,"day")}</div>
                    </div>

                    <div className="service-info">
                        <div className="info title">{service.name}</div>
                        <div className="info">{service.location}</div>
                        <div className="info">{this.parseDate(service.date,"time")}</div>
                    </div>
                </div>
            ))
        )
    }

    parseDate(stdate, type){
        var ret = null;
        var Month = ["Jan", "Feb", "Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];

        try {
            var date = new Date(stdate);
            switch(type){
                case "day":
                    ret = (date.getDate() < 10 ? "0"+date.getDate() : date.getDate());
                    break;
                case "month":                    
                    ret = Month[date.getMonth()];
                    break;
                case "year":
                    ret = date.getFullYear();
                    break;
                case "time":
                    ret = ((date.getHours() +1 > 12) ? (date.getHours()+1) -12 : (date.getHours()+1)) +":"
                    + ((date.getMinutes() < 10) ? "0"+ date.getMinutes() : date.getMinutes())
                    + ((date.getHours() +1 > 12) ? " PM" : " AM");
                    break;
                case "date":
                    ret = Month[date.getMonth()] + " " + date.getDate() + " ";
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

    phraseWriter(phrase, callback){
        var self = this;
        try {
            /* Type Text */                        
            self.setState({ introTitle:"Roy L. Gilmore Funeral Home Inc.", selectedPhrase: [] }, () => {
                setTimeout(function () {
                    self.typePhrase(phrase, function(){
                        setTimeout(function () {callback();}, self.state.readPause);
                    });
                }, self.state.prePause);
            });   
        }
        catch(ex){
            console.log("Error with phrasewriter: ",ex);
        }
    }

    typePhrase(phrase, callback){
        var self = this;
        try {
            let k = 0; 
            let textSz = 0;
            phrase.map(function(item){ textSz = textSz + item.text.length; return item; });
            
            for(var i=0; i < phrase.length; i++){
                let i2 = i;
                for(var j =0; j < phrase[i].text.length; j++){
                    let j2 = j;
                    setTimeout(function () {
                        var tmpPhraseList = self.state.selectedPhrase;
                        if(tmpPhraseList.length < i2+1 ){
                            tmpPhraseList.push({text:"", class:phrase[i2].class});
                        }
                        tmpPhraseList[i2].text = tmpPhraseList[i2].text + phrase[i2].text[j2];
                        
                        self.setState({ selectedPhrase: tmpPhraseList}, () =>{
                            if((i2+1) >= phrase.length && (j2+1) >= phrase[i2].text.length) { callback(); }
                        });
                    }, self.state.typePause * (k+1));
                    k++;
                }
            }
        }
        catch(ex){
            console.log("[ERROR] Typing Phrase: ",ex);
        }
    }

    componentDidMount(){
        var self = this;
        try {
            window.scrollTo(0, 0);
            this.phraseWriter(this.state.introPhrase, function(){ 
                self.setState({ signature: true });
            });
        }
        catch(ex){
            console.log("Error with mount:", ex);
        }        
    }
 
    
    render(){  
        return(
            <div className="page-body home">
                <section className="landing-section">
                    <div className="text-cover">
                        <h1>{this.state.introTitle}</h1> 
                        <div className="writer-phrase">
                            {this.state.selectedPhrase.map((item,i) =>
                                <div className={"line-item "+item.class} key={i}><span>{item.text}</span></div>
                            )}
                        </div>
                        {(this.state.signature === true) && <Signature />}
                    </div>
                    <div className="img-cover"><img src={back} alt="Funeral Background"/></div>

                    {/* Service Time Tool */}
                    <div className="serviceTime-scroller lifted">
                        <div className="scroller-title">Our Services</div>
                        <div className="scroller-container">
                            <AliceCarousel className="scroller-carousel" items={this.buildEventItems()}
                                autoPlayInterval={4000} disableDotsControls disableButtonsControls 
                                mouseTracking autoPlay infinite
                                responsive={this.state.responsive} ref={ el => this.Carousel = el }/>
                        </div>
                    </div>
                </section>
                <section className="about"></section>
            </div>
        );
    }
}
export default Home;