import React, { Component } from 'react';

/* Images */
import home1 from '../../assets/imgs/home1.jpeg';
import home2 from '../../assets/imgs/home2.jpeg';
import home3 from '../../assets/imgs/home3.jpeg';
import home4 from '../../assets/imgs/home4.jpeg';
import home5 from '../../assets/imgs/home5.jpeg';

class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){  
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
                </div>
            </div>
        );
    }
    
    componentDidMount(){}
}
export default Home;