import React, { Component } from 'react';

class LoadSpinner extends Component{   
    componentDidMount(){ }
    
    render(){        
        return(
            <div id="loader-wrapper">
                <div id="loader" className="base"></div>
            </div>
        );        
    }
}

export default LoadSpinner;