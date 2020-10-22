import React, { Component } from 'react';
import ProgressBar from 'react-customizable-progressbar'

import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from 'react-alice-carousel';

import axios from 'axios';

/* Images */
import back from '../../assets/imgs/exterior3.jpg';

/* Components */
import Signature from '../components/signature';

var phraseInfo = null;
var phraseInfo2 = [];
var writerStatus = false;
var rootPath = ( false ? "http://localhost:1245" : "");

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
            phraseSz:{current:0, final:1 },
            responsive: {
                0: { items: 1 }, 600: { items: 2 }, 1024: { items: 2 }
            },
            responsivePhoto: {
                0: { items: 2 }, 600: { items: 2 }, 1024: { items: 2 }
            },
            serviceList:[],
            faqList:[
                { question:"Why do I have to use a funeral home?", answer:"You are not legally required to use a funeral home to plan and conduct a funeral. But because most of us do not have experience with the details and legal requirements involved, the services of a professional funeral home may be necessary and helpful." },
                { question:"What happens when someone passes away out of town?", answer:"Funeral directors work together every day to coordinate the shipment of human remains between different cities, states and countries. If someone dies while travelling out-of-town, contact the funeral director in your home town. He or she can work with a local funeral director and the authorities where the death occurred to make arrangements to bring your loved one home. If the death occurs in a city where you or someone you trust is familiar with a local funeral home, you can also contact them for assistance." },
                { question:"Do I need a funeral director?", answer:"In New York State, a licensed funeral director is required to make funeral arrangements and make the final disposition of the body. In addition to providing for the final disposition of human remains, the funeral director is a caregiver, listener and coordinator. As a caregiver, the funeral director helps the survivors make choices regarding the funeral and disposition. The funeral director is trained to listen and help survivors cope with their loss and when necessary, be able to make a referral to other professionals for additional help. An important function of the funeral director is to relieve the survivors of having to make arrangements for a religious or fraternal service, preparing a death notice, ordering flowers and arranging for a burial or cremation." },
                { question:"Why have funeral ceremonies?", answer:"Funerals are age-old rituals that serve to honor the deceased. What has been found to be of equal importance is that the funeral also helps the survivors cope with the loss by playing an important part in the grief process. We all go through a psychological change with the loss of a loved one. The grief process, as the change is called, helps us live with the loss. The funeral helps us to initiate behaviors that might not be available to us without the funeral." }
            ],
            testimonialList:[
                { info:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", name:"Wilson Family"},
                { info:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,", name:"Jackson Family"},
                { info:"Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", name:"Bridge Family"},
                { info:"Aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,", name:"Maximon Family"},
                { info:"Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", name:"Falls Family"},
                { info:"Guis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,", name:"Acura Family"}
            ],
            formData:{"name":"", "email":"", "phone":"","message":""},
            contactForm:[
                {"type":"input-line","sz":10, "required":true, "name":"name", "placeholder":"Name"},
                {"type":"input-line","sz":10, "required":true, "name":"email", "placeholder":"Email"},
                {"type":"input-line","sz":10, "required":true, "name":"phone", "placeholder":"Phone"},
                {"type":"textarea","sz":10, "required":false, "name":"message", "placeholder":"Message"}
            ]
        }
        
        /* Functions */
        this.getServiceList = this.getServiceList.bind(this);
        this.buildPhotoList = this.buildPhotoList.bind(this);
        this.buildEventItems = this.buildEventItems.bind(this);   
        this.buildTestimonialList = this.buildTestimonialList.bind(this);     
        this.parseDate = this.parseDate.bind(this);
        this.phraseWriter = this.phraseWriter.bind(this);
        this.typePhrase = this.typePhrase.bind(this);
        this.stopWriter = this.stopWriter.bind(this);
        this.pageLocation = this.pageLocation.bind(this);
        this.formElement = this.formElement.bind(this);
        this.onElementChange = this.onElementChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }  
    
    getServiceList(){
        var self = this;
        try {
            var postData = { search:"", size:10, page:1 };
            axios.post(rootPath + "/api/getServices", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        console.log(" [Error] Getting Service List(1): ", response.data.errorMessage);
                    }
                    else if(response.data.results.list && response.data.results.list.length >= 0){
                        self.setState({ serviceList: response.data.results.list });
                    }
                }); 
        }
        catch(ex){
            console.log(" [Error] Getting Service List: ",ex);
        }
    }

    buildPhotoList(){
        try {
            var photoList = ["exterior1.jpg","interior1.JPG","interior2.JPG","interior3.JPG","interior4.JPG","interior5.JPG",
                            "interior6.JPG","interior7.JPG","interior8.JPG","interior9.JPG", "exterior2.jpg", "exterior4.jpg",
                            "exterior5.jpg", "exterior6.jpg","exterior7.jpg","exterior8.jpg"];
            return(
                photoList.map((photo,i) => (
                    <div className="photo-item" key={i}><img src={"./images/"+photo} alt={"Funeral Home "+i}/></div>
                ))
            )
        }
        catch(ex){
            console.log("Error building photo list: ",ex);
        }        
    }

    buildEventItems() {
        try {
            return (
                this.state.serviceList.map((service, i) => ( 
                    <div className="service-item" key={i}>
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
        catch(ex){
            console.log(" [Error] Building Event Items: ",ex);
        }
    }

    buildTestimonialList(){
        try {
            return (
                this.state.testimonialList.map((test, i) => ( 
                    <div className="testimonial-item" key={i}>
                        <p className="test-info"><i class="fas fa-quote-left" />{test.info}<i class="fas fa-quote-right" /></p>
                        <p className="test-name">{test.name}</p>
                    </div>
                ))
            )            
        }
        catch(ex){
            console.log(" [Error] Building Event Items: ",ex);
        }
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
            writerStatus = false;
            /* Type Text */                        
            self.setState({ introTitle:"Roy L. Gilmore Funeral Home Inc.", selectedPhrase: [] }, () => {
                phraseInfo = setTimeout(function () {
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
            let textSz = { current:0, final:0};
            phrase.map(function(item){ textSz.final = textSz.final + item.text.length; return item; });
            self.setState({ phraseSz: textSz });

            for(var i=0; i < phrase.length; i++){
                let i2 = i;
                for(var j =0; j < phrase[i].text.length; j++){
                    let j2 = j;
                    phraseInfo2.push(setTimeout(function () {
                        var tmpPhraseList = self.state.selectedPhrase;
                        if(tmpPhraseList.length < i2+1 ){
                            tmpPhraseList.push({text:"", class:phrase[i2].class});
                        }
                        tmpPhraseList[i2].text = tmpPhraseList[i2].text + phrase[i2].text[j2];
                        
                        textSz.current++;
                        self.setState({ selectedPhrase: tmpPhraseList, phraseSz: textSz}, () =>{
                            if((i2+1) >= phrase.length && (j2+1) >= phrase[i2].text.length) { callback(); }
                        });
                    }, self.state.typePause * (k+1)));
                    k++;
                }
            }
        }
        catch(ex){
            console.log("[ERROR] Typing Phrase: ",ex);
        }
    }

    stopWriter(){
        var self = this;
        try {
            clearTimeout(phraseInfo);
            for(var i =0; i < phraseInfo2.length; i++){
                clearTimeout(phraseInfo2[i]);
            }

            this.setState({ selectedPhrase: this.state.introPhrase }, () =>{ writerStatus = true; self.setState({ signature: true });});
        }
        catch(ex){
            console.log(" [ERROR] Stopping Writer: ",ex);
        }
    }

    pageLocation(){
        var self = this;
        try {
            window.addEventListener('scroll', function(){
                try {
                    var y = window.scrollY;
                    var writerPostEl = document.getElementById("writerPost");
                    
                    var writerLoc = writerPostEl.offsetTop + (writerPostEl.clientHeight*.4);

                    if(!writerStatus && writerPostEl && y >= (writerLoc - window.innerHeight) ){
                        writerStatus = true;
                        self.stopWriter();
                    }   
                    
                    /* Page Nav */
                    var section1 = document.getElementById("aboutus");
                    var section2 = document.getElementById("preparing");
                    var section3 = document.getElementById("contactus");
                    
                    if(y >= section1.offsetTop && y < (section2.offsetTop - 50)) {
                        self.props.changePageLoc("aboutus");
                    }   
                    else if(y >= section2.offsetTop && y < (section3.offsetTop -50)) {
                        self.props.changePageLoc("preparing");
                    }   
                    else if(y >= (section3.offsetTop - 50)) {
                        self.props.changePageLoc("contactus");
                    }    
                    else {
                        self.props.changePageLoc("");
                    }
                }
                catch(ex){
                    console.log("Error with Scroll List: ", ex);
                }
            });
        }
        catch(ex){
            console.log(" [ERROR] checking page location: ",ex);
        }
    }

    formElement(el){
        switch(el.type) {
            case "input":
                return <input type="text" name={el.name} className={(el.required && this.state.formData[el.name].length <= 0 ? "empty":"")} placeholder={el.placeholder +(el.required ?"*":"")} value={this.state.formData[el.name] || ''} onChange={(e) => this.onElementChange(e)}/>;
            case "input-line":
                return <div className="line-group"><input type="input" className="line-field" placeholder={el.placeholder} name={el.name} /> <label htmlFor={el.name} className="line-label">{el.placeholder}</label></div>;
            case "textarea":
                    return <textarea name={el.name} className={(el.required && this.state.formData[el.name].length <= 0 ? "empty":"")} placeholder={el.placeholder +(el.required ?"*":"")} value={this.state.formData[el.name] || ''} onChange={(e) => this.onElementChange(e)} />;
            default:
                return <div/>;
        }
    }

    onElementChange(event){
        var self = this;
        try {
            var tmpData = this.state.formData;
            var name = event.target.name;

            if(name in tmpData) {
                tmpData[name] = event.target.value;
                self.setState({ formData:tmpData });
            }
        }
        catch(ex){
            console.log("[ERROR] on element change: ",ex);
        }
    }

    submitForm(event){
        try {
           
        }
        catch(ex){
            console.log("[ERROR] submitting form: ",ex);
        }
    }

    componentDidMount(){
        var self = this;
        try {
            window.scrollTo(0, 0);
            this.pageLocation();
            this.getServiceList();
            this.phraseWriter(this.state.introPhrase, function(){ 
                writerStatus = true;
                self.setState({ signature: true });
            });
        }
        catch(ex){
            console.log("Error with mount:", ex);
        }        
    }
    
    componentWillUnmount() {
        this.stopWriter();
    }
    
    render(){  
        return(
            <div className="page-body home" id="scroll-page">
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
                    
                    {/* Type Loader */}
                    {!writerStatus && <div className="load-bar" onClick={this.stopWriter}>
                        <ProgressBar progress={100 * (this.state.phraseSz.current / this.state.phraseSz.final)} radius={100} strokeColor="rgb(99,36,35)" trackStrokeColor="rgb(255,255,255)"/>
                        <i className="fas fa-stop" />
                    </div>}

                    {/* Service Time Tool */}
                    <div className="serviceTime-scroller lifted">
                        <div className="scroller-title">Our Services</div>
                        {this.state.serviceList.length > 0 && 
                            <div className="scroller-container">
                                <AliceCarousel className="scroller-carousel" items={this.buildEventItems()}
                                    autoPlayInterval={4000} disableDotsControls disableButtonsControls 
                                    mouseTracking autoPlay infinite
                                    responsive={this.state.responsive} ref={ el => this.Carousel = el }/>
                            </div>
                        }
                    </div>
                </section>
                
                <section className="about background-pattern1" id="aboutus">
                    <div className="about-text">
                        <h1>Family Owned & Operated, Since 1974</h1>
                        <p>A tradition passed on from generation to generation, the Gilmore family has dedicated their lives to serving families in their time of need. The family approach of service is simple, "Serving families with excellence, fully dedicated to earning their trust and providing the highest level of understanding.</p>
                        <p>We strive to serve each family with the compassion, dignity, and the respect they deserve in their time of need. The "family-owned" personal touch of funeral service is prevalent in all we do. Serving all denominations and faiths; celebrations of life.</p>
                    </div>
                    <div className="about-img-container" id="writerPost">
                        <AliceCarousel className="photo-scroller" items={this.buildPhotoList()}
                            autoPlayInterval={7000} disableDotsControls disableButtonsControls mouseTracking infinite
                            responsive={this.state.responsivePhoto} ref={(el) => this.photoCarousel = el }/>
                        
                        <div className="scroll-ctrl">
                            <div className="ctrl-item left" onClick={() => this.photoCarousel.slidePrev()}><i className="fas fa-chevron-left"/></div>
                            <div className="ctrl-item right" onClick={() => this.photoCarousel.slideNext()}><i className="fas fa-chevron-right"/></div>
                        </div>
                    </div>
                </section>
                
                
                <section className="preparing background-pattern1" id="preparing">
                    <div className="prep-faq">
                        <div className="accordion" id="faqAccordion">
                            {this.state.faqList.map((item,i) => 
                                <div className="card" key={i}>
                                    <div className="card-header" id={"heading-"+i}>
                                        <h2 className="mb-0">
                                            <button className="btn btn-link" type="button" data-toggle="collapse" data-target={"#collapse-"+i} aria-expanded="false" aria-controls={"collapse-"+i}>
                                                <i className="fas fa-chevron-right" /> {item.question}
                                            </button>
                                        </h2>
                                    </div>
                                    <div id={"collapse-"+i} className="collapse" aria-labelledby={"heading-"+i} data-parent="#faqAccordion">
                                        <div className="card-body">{item.answer}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="prep-text">
                        <h1>Preparing For A Funeral</h1>
                        <p>The family approach of service is simple, "Serving families with excellence, fully dedicated to earning their trust and providing the highest level of understanding.</p>
                        <p>The "family-owned" personal touch of funeral service is prevalent in all we do. Serving all denominations and faiths; celebrations of life.</p>
                    </div>
                </section>
                
                <section className="contactUs" id="contactus">
                    <div className="contact-info">
                        <h1>Contact Us</h1>
                        <p>We strive to serve each family with the compassion, dignity, and the respect they deserve in their time of need. </p>
                        <div className="contact-lines">
                            <div className="info-line title">Address</div>
                            <div className="info-line">191-02 Linden Blvd.</div>
                            <div className="info-line">St. Albans, NY. 11412</div>
                        </div>
                        <div className="contact-lines">
                            <div className="info-line title">Contact Information</div>
                            <div className="info-line"><span>Phone</span>(718) 529-3030</div>
                            <div className="info-line"><span>Fax</span>(718) 528-2575</div>
                            <div className="info-line mini"><span>Email</span><span className="mini">royl.gilmorefuneralhome@verizon.net</span></div>
                        </div>
                    </div>
                    <div className="contact-form">
                        {this.state.contactForm.map((item,i) => (
                            <div key={i} className={"form-element sz-"+item.sz}>{ this.formElement(item) }</div>
                        ))}  

                        <div className="btn-container">
                            <div className="lBtn lifted" onClick={this.submitForm}><span>Submit</span><i className="btn-icon far fa-paper-plane"></i></div>
                        </div>
                    </div>                    
                </section>  

                <section className="testimonials">
                    <h1>Testimonial</h1>
                    <AliceCarousel className="testimonial-scroller" items={this.buildTestimonialList()} autoPlayInterval={7000} disableButtonsControls mouseTracking responsive={this.state.responsive} />   
                </section>   
            </div>
        );
    }
}
export default Home;