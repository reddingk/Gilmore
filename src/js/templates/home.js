import React, { Component } from 'react';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

/* Images */
import defaultImgAlt from '../../assets/imgs/logo_c1.png';
import home1 from '../../assets/imgs/home1.jpeg';
import home2 from '../../assets/imgs/home2.jpeg';
import home3 from '../../assets/imgs/home3.jpeg';
import home4 from '../../assets/imgs/home4.jpeg';
import home5 from '../../assets/imgs/home5.jpeg';

const carouselOptions = {
    duration:400,
    autoPlayInterval:7000,
    responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1024: { items: 3 },
    }
};

class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            obituaries:[
                {id:0, name:"Bernie Mac", imgurl:"https://vignette.wikia.nocookie.net/disney/images/6/6e/Bernie_Mac.jpg/revision/latest?cb=20180426010043"},
                {id:1, name:"John Witherspoon", imgurl:"https://www.billboard.com/files/styles/article_main_image/public/media/john-witherspoon-tracy-morgan-show-obit-billboard-1548.jpg"},
                {id:2, name:"Paul Walker", imgurl:"https://i1.wp.com/metro.co.uk/wp-content/uploads/2019/08/GettyImages-105110849-e1565444355445.jpg?quality=90&strip=all&zoom=1&resize=644%2C538&ssl=1"},
                {id:3, name:"John Singleton", imgurl:"https://static.parade.com/wp-content/uploads/2019/12/John-Singleton-FTR.jpg"},
                {id:4, name:"Diahann Carroll", imgurl:"https://static.parade.com/wp-content/uploads/2019/12/Diahann-Carroll-FTR.jpg"},
                {id:5, name:"Nipsey Hussle", imgurl:"https://static.parade.com/wp-content/uploads/2019/12/Nipsey-Hussle-FTR.jpg"},
                {id:6, name:"No Name", imgurl:null}
            ]
        }

        this.loadMap = this.loadMap.bind(this);
    }

    buildCarouselList(){
        return(
            this.state.obituaries.map((item,i) => (
                <div key={i} className="item-container">                    
                    <div className="img-container">
                        <img src={(item.imgurl && item.imgurl !== "" ? item.imgurl : defaultImgAlt)} />
                    </div>
                    <p>{ item.name }</p>
                    <a href="" className="obituaryLink">Read More <i className="fas fa-angle-double-right" /></a>                   
                </div>
            ))
        )
    }

    loadMap() {
        var self = this;
        try {
            var map = new mapboxgl.Map({
                container: this.mapContainer,
                style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',  // Theme URL; see our themes documentation for more options
                center: [-73.7622429, 40.6921173],  
                zoom: 4
              });

              mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.1/mapbox-gl-rtl-text.js');

              // Add zoom and rotation controls to the map.
              map.addControl(new mapboxgl.NavigationControl());
        }
        catch(ex){
            console.log("Error loading map: ",ex);
        }
    }

    render(){ 
        var obituariesList = this.buildCarouselList();

        return(
            <div className="page-body home">
                <div className="home-section cover-section">
                    <div className="cover">
                        <img src={home3} />
                    </div>
                    <div className="cover-text">
                        <h1>Roy L. Gilmore Funeral Home</h1>
                        <p><span>&ldquo;</span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<span>&rdquo;</span></p>
                    </div>
                </div>

                <div className="home-section text-section">
                    <h1 className="section-title">Family Owned & Operated, Since 1974</h1>
                    <p className="bold-txt">Sed ut perspiciatis unde omnis iste natus error sit voluptatem 
                        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa 
                        quae ab illo inventore veritatis et quasi architecto beatae vitae 
                        dicta sunt explicabo.</p>
                    <p>Nemo enim ipsam voluptatem quia voluptas sit 
                        aspernatur aut odit aut fugit, sed quia consequuntur magni dolores 
                        eos qui ratione voluptatem sequi nesciunt.</p>
                    <div className="btn-container">
                        <a href="" className="page-btn c1">More Information <i className="fas fa-info-circle" /></a>
                    </div>
                </div>

                <div className="home-section space-area">
                    <div className="list-area">
                        <div className="list-item">
                            <h2>Arrange Funeral</h2>
                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                            <div className="btn-container">
                                <a href="" className="page-btn c2">Get Started <i className="fas fa-chevron-right" /></a>
                            </div>
                        </div>

                        <div className="list-item">
                            <h2>Our Services</h2>
                            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                            <div className="btn-container">
                                <a href="" className="page-btn c2">Learn More <i className="fas fa-book-open" /></a>
                            </div>
                        </div>

                        <div className="list-item">
                            <h2>Internal Service Time</h2>
                            <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
                            <div className="btn-container">
                                <a href="" className="page-btn c2">Service Tool <i className="fas fa-toolbox" /></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="home-section horizontal-list">
                    <h1 className="section-title">Recent Obituaries</h1>

                    <div className="list-container">                      
                        <span className="ctrl-container">
                            <span className="ctrl prev" onClick={() => this.Carousel.slidePrev()}><i className="fas fa-chevron-left" /></span>
                            <span className="ctrl next" onClick={() => this.Carousel.slideNext()}><i className="fas fa-chevron-right" /></span>
                        </span>

                        <AliceCarousel className="obituary-carousel" items={obituariesList} autoPlay={true} autoPlayInterval={carouselOptions.autoPlayInterval }
                                    duration={carouselOptions.duration} mouseDragEnabled={true} responsive={carouselOptions.responsive}
                                    buttonsDisabled={true} dotsDisabled={true} ref={(el) => (this.Carousel = el)}/>                       
                    </div>
                </div>

                <div className="home-section location-map">
                    <div className="contact-container">
                        <div className="contactmap" ref={el => this.mapContainer = el}></div>
                    </div>
                </div>
            </div>
        );
    }
    
    componentDidMount(){
        this.loadMap();
    }
}
export default Home;