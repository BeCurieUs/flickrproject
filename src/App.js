import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Flickr from "flickrapi";
const myapi_key = "3347f47687a578f9048de57e5561217f";
const api_secret = "5c9d856058d4cd88"




const flickr = new Flickr({
  api_key: myapi_key,
  progress: false
});



class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
