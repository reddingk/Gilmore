import React, { Component } from 'react';

import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from 'react-alice-carousel';
import ReactGA from 'react-ga';
import axios from 'axios';

import LoadSpinner from '../components/loadSpinner';

/* Images */
import back from '../../assets/imgs/exterior11.jpg';

var writerStatus = false;
var rootPath = ( window.location.href.indexOf("localhost") > -1  ? "http://localhost:1245" : "");

class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            prePause:700,
            typePause:50,
            selectedIndex: 0,
            selectedPhrase:[
                { text:"As a family owned business, it is our distinct privilege to be able to provide information and services to those we serve with understanding.", class:"base"},
                { text:"Thank you kindly for your time,", class:"base line"}
            ],
            displayPhrase: false,
            signature:false,
            introTitle:"Roy L. Gilmore Funeral Home Inc.",
            introPhrase:[
                { text:"As a family owned business, it is our distinct privilege to be able to provide information and services to those we serve with understanding.", class:"base"},
                { text:"Thank you kindly for your time,", class:"base line"}
            ],
            phraseSz:{current:0, final:1 },
            responsive: {
                0: { items: 1 }, 600: { items: 2 }, 1024: { items: 2 }
            },
            responsivePhoto: {
                0: { items: 1 }, 600: { items: 2 }, 1024: { items: 2 }
            },
            serviceList:[], photoGallery:[],
            faqList:[], testimonialList:[],
            formData:{"name":"", "email":"", "phone":"","message":""},
            contactForm:[
                {"type":"input-line","sz":10, "required":true, "name":"name", "placeholder":"Name *"},
                {"type":"input-line","sz":10, "required":true, "name":"email", "placeholder":"Email"},
                {"type":"input-line","sz":10, "required":true, "name":"phone", "placeholder":"Phone *"},
                {"type":"textarea","sz":10, "required":false, "name":"message", "placeholder":"Message *"}
            ]
        }
        
        /* Functions */
        this.getPageData = this.getPageData.bind(this);
        this.getServiceList = this.getServiceList.bind(this);
        this.buildPhotoList = this.buildPhotoList.bind(this);
        this.buildEventItems = this.buildEventItems.bind(this);   
        this.buildTestimonialList = this.buildTestimonialList.bind(this);     
        this.parseDate = this.parseDate.bind(this);
        this.pageLocation = this.pageLocation.bind(this);
        this.formElement = this.formElement.bind(this);
        this.onElementChange = this.onElementChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.initialReactGA = this.initialReactGA.bind(this);
    }  
    
    getPageData(){
        var self = this;
        try {
            var postData = { url:"stories/home" };
            axios.post(rootPath + "/api/getPageData", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.error){
                        console.log(" [Error] Getting Home Page Data (E1): ", response.data.error);
                    }
                    else if(response.data.results){
                        self.setState({ faqList: response.data.results.FAQ, 
                            testimonialList: response.data.results.Testimonials,
                            photoGallery: response.data.results.PhotoGallery
                        })
                    }
                }); 
        }
        catch(ex){
            console.log("Error getting home page data: ",ex);
        }
    }

    getServiceList(){
        var self = this;
        try {
            this.setState({ loading: true }, ()=>{
                var postData = { search:"", size:10, page:1 };
                axios.post(rootPath + "/api/getServices", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.error){
                            console.log(" [Error] Getting Service List (E1): ", response.data.error);
                            self.setState({ loading: false });
                        }
                        else if(response.data.results.list && response.data.results.list.length >= 0){
                            self.setState({ loading: false, serviceList: response.data.results.list });
                        }
                    }); 
            });
        }
        catch(ex){
            console.log(" [Error] Getting Service List: ",ex);
        }
    }

    buildPhotoList(){
        try {
            if(this.state.photoGallery.length > 0) {
                return(                    
                    this.state.photoGallery.map((photo,i) => (
                        <div className="photo-item" key={i}>
                            {photo.component === "Photo" ?
                                <img src={photo.image} alt={(photo.title ? photo.title : "Funeral Home "+i)}/>
                                : <iframe title="buzzfeed-video" src={photo.url}/>
                            }
                        </div>
                    ))                    
                )
            }
            else {
                return(
                    [0,1,2,3,4].map((item,i) =>(
                        <div className="photo-item empty" key={i}><div className="no-photo"/></div>
                    ))
                )
            }
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
            if(this.state.testimonialList.length > 0) {
                return (
                    this.state.testimonialList.map((test, i) => ( 
                        <div className="testimonial-item" key={i}>
                            <p className="test-info"><i className="fas fa-quote-left" />{test.quote}<i className="fas fa-quote-right" /></p>
                            <p className="test-name">{test.name}</p>
                        </div>
                    ))
                )  
            }     
            else {
                return (
                    [0,1,2,3,4].map((test, i) => ( 
                        <div className="testimonial-item" key={i}><div className="no-data"/></div>
                    ))
                )  
            }     
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

    submitForm(){
        var self = this;
        try {
            if(self.state.formData.name.length <= 0 || self.state.formData.phone.length <= 0 || self.state.formData.message.length <= 0){
                alert("Please Fill All Required Fields");
            }
            else {
                var postData = { 
                    name: self.state.formData.name, 
                    email: self.state.formData.email, 
                    phone: self.state.formData.phone, 
                    message: self.state.formData.message
                };

                axios.post(rootPath + "/api/sendEmail", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.error){
                            console.log(" [ERROR] Sending Email: ", response.data.error);
                        }
                        else if(response.data.results){
                            
                        }
                    }); 
            }
        }
        catch(ex){
            console.log(" [ERROR] Sending Email: ",ex);
        }
    }

    initialReactGA(){
        //ReactGA.initialize('');
        ReactGA.pageview('/home');
    }

    componentDidMount(){
        var self = this;
        try {
            window.scrollTo(0, 0);
            this.initialReactGA();
            this.getPageData();
            this.pageLocation();
            this.getServiceList();
            setTimeout(function(){ 
                self.setState({ displayPhrase: true })
            }, 1000);
        }
        catch(ex){
            console.log("Error with mount:", ex);
        }        
    }
    
    componentWillUnmount() {}
    
    render(){  
        document.title ="Roy L. Gilmore Funeral Home";
        return(
            <div className="page-body home" id="scroll-page">
                {this.state.loading && <LoadSpinner /> }
                <section className="landing-section">
                    <div className="text-cover">
                        <h1>{this.state.introTitle}</h1> 
                        <div className={"writer-phrase " +(this.state.displayPhrase ? "wshow" : "")}>
                            {this.state.selectedPhrase.map((item,i) =>
                                <div className={"line-item "+item.class} key={i}><span>{item.text}</span></div>
                            )}
                        </div>
                    </div>
                    <div className="img-cover"><img src={back} alt="Funeral Background"/></div>                  

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

                        {this.state.serviceList.length === 0 && 
                            <div className="no-data">Upcoming services coming soon</div>
                        }
                    </div>
                </section>
                
                <section className="about background-pattern1" id="aboutus">
                    <div className="about-text">
                        <h1>Family Owned & Operated, Since 1954</h1>
                        <p>A tradition passed on from generation to generation, the Gilmore family has dedicated their lives to serving families in their time of need. The family approach of service is simple, "Serving families with excellence, fully dedicated to earning their trust and providing the highest level of understanding.</p>
                        <p>We strive to serve each family with the compassion, dignity, and the respect they deserve in their time of need. The "family-owned" personal touch of funeral service is prevalent in all we do. Serving all denominations and faiths; celebrations of life.</p>
                        <p>Featured video <a href="https://www.youtube.com/watch?v=bfju-IExuPA&t=1s" target="_blank" rel="noopener noreferrer">Undertakers Answer Googled Questions About Death</a></p>
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

                            {this.state.faqList.length <= 0 && 
                                <div className="no-data-container">
                                    <div className="no-data"/><div className="no-data"/>
                                    <div className="no-data"/><div className="no-data"/>                                    
                                </div>
                            }

                            {/* Special Video */}
                            <div className="card special">
                                <div className="card-header" id="heading-qa">
                                    <h2 className="mb-0">
                                        <button className="btn btn-link special" type="button" data-toggle="collapse" data-target="#collapse-qa" aria-expanded="false" aria-controls="collapse-qa">
                                            <i className="fas fa-chevron-right" />Additional questions answered by our team
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapse-qa" className="collapse" aria-labelledby="heading-qa" data-parent="#faqAccordion">
                                    <div className="card-body"><iframe title="buzzfeed-video" src="https://www.youtube.com/embed/bfju-IExuPA"/></div>
                                </div>
                            </div>
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