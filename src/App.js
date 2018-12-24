import React, { Component } from 'react';
import './App.css';
const myapi_key = "3347f47687a578f9048de57e5561217f";
const api_secret = "5c9d856058d4cd88"

class App extends Component {

  state = {
    picList : [],
    searchTerm : "cats",
  }

  componentDidMount() {
    this.searchFlickr();
  }


  searchFlickr = () =>{
    fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${myapi_key}&tags=${this.state.searchTerm}&per_page=50&page=1&format=json&nojsoncallback=1`)
    .then(response => response.json())
    .then(data => {
      data.photos.photo.forEach((picItem,index) => {
        const imgPath = `https://farm${picItem.farm}.staticflickr.com/${picItem.server}/${picItem.id}_${picItem.secret}_m.jpg`
        this.setState({picList: [...this.state.picList,
          <a key = {index} target="_blank" href={`https://farm${picItem.farm}.staticflickr.com/${picItem.server}/${picItem.id}_${picItem.secret}.jpg`}>
            <img key={index} className="responsive-image" src={imgPath} alt={picItem.title}/>
          </a>
          ]})
      });
    })
  }


  handleSubmit= (event) => {
    event.preventDefault();
    this.setState({searchTerm :event.target.value}) 
  }





  handleChange = (event) =>{
    this.setState({searchTerm: event.target.value});
  }

  handleSubmit = (event) =>{
    event.preventDefault();
    this.setState({picList:[]})
    this.searchFlickr();
  }


  render() {
    return (
      <div className="Form">
        <form onSubmit={this.handleSubmit}>
          <label>
            Search for:
          <input type="text" value={this.state.searchTerm} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <div className="App">
          {this.state.picList}
        </div>
      </div>
    );
  }
}

export default App;
