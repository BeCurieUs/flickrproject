import React, { Component } from 'react';

class Flickrimg extends Component {
  
  getSize = () =>{
    if(this.props.size!==undefined){
      return "_"+this.props.size
    }
    return "";
  }

  
  render() {
    return (
      <img src={`https://farm${this.props.farm}.staticflickr.com/${this.props.server}/${this.props.id}_${this.props.secret}${this.getSize()}.jpg`} alt={this.props.title}/>
    );
  }
}

export default Flickrimg;

