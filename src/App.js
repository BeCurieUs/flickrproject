import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './App.css';
const myapi_key = "3347f47687a578f9048de57e5561217f";
const api_secret = "5c9d856058d4cd88"


class App extends Component {

  state = {
    user_id : "11860006@N08",
    printCollection : [],
    completePhotostream : [],
  }

  componentDidMount() {
    this.searchFlickr();
  }


  searchFlickr = () =>{
    fetch(`https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${myapi_key}&user_id=${this.state.user_id}&format=json&nojsoncallback=1`)
    .then(response => response.json())
    .then(data => {
      // console.log(JSON.stringify(data, null, 2))
      data.photosets.photoset.forEach( (photoCollection,index) => {
        fetch(`https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${myapi_key}&photoset_id=${photoCollection.id}&format=json&nojsoncallback=1`)
        .then(innerResponse => innerResponse.json())
        .then(innerData => {
          // console.log(photoCollection.title._content)
          // console.log(innerData.photoset.photo)
          this.setState({
            completePhotostream : [...this.state.completePhotostream,{title : photoCollection.title._content, farm:photoCollection.farm, id:photoCollection.primary, server:photoCollection.server, secret:photoCollection.secret , photos : innerData.photoset.photo}]
          })
        })
      });
      // console.log(this.state.collectionsList)
      // this.printImageList(this.state.collectionsList)
    })
  }

  printImageList = (flickrImageArray) =>{
    flickrImageArray.forEach((imageObject,index)=>{
      const imgPath = `https://farm${imageObject.farm}.staticflickr.com/${imageObject.server}/${imageObject.id}_${imageObject.secret}_q.jpg`
      // console.log(imgPath)
      this.setState({printCollection : [...this.state.printCollection,<img key={index} className="responsive-image" src={imgPath} alt={imageObject.title._content}/>]})
      

    })
  }

  // image tag search code

  // searchFlickr = () =>{
  //   fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${myapi_key}&tags=${this.state.searchTerm}&per_page=50&page=1&format=json&nojsoncallback=1`)
  //   .then(response => response.json())
  //   .then(data => {
  //     data.photos.photo.forEach((picItem,index) => {
  //       const imgPath = `https://farm${picItem.farm}.staticflickr.com/${picItem.server}/${picItem.id}_${picItem.secret}_m.jpg`
  //       this.setState({picList: [...this.state.picList,
  //         <a key = {index} target="_blank" href={`https://farm${picItem.farm}.staticflickr.com/${picItem.server}/${picItem.id}_${picItem.secret}.jpg`}>
  //           <img key={index} className="responsive-image" src={imgPath} alt={picItem.title}/>
  //         </a>
  //         ]})
  //     });
  //   })
  // }

  // handleSubmit= (event) => {
  //   event.preventDefault();
  //   this.setState({searchTerm :event.target.value}) 
  // }
  getSize = () =>{
    if(this.props.size!==undefined){
      return "_"+this.props.size
    }
    return "";
  }

  urlGenerator = (farm,server,id,secret,size) => {
    return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}${this.getSize()}.jpg`
  }


  // handleChange = (event) =>{
  //   this.setState({searchTerm: event.target.value});
  // }

  // handleSubmit = (event) =>{
  //   event.preventDefault();
  //   this.setState({picList:[]})
  //   this.searchFlickr();
  // }


  render() {
    return (
      <div className="main">
        <div className="form">
          <form onSubmit={this.handleSubmit}>
            <label>
              Enter Your Flickr User ID:
            <input type="text" value={this.state.searchTerm} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit"/>
          </form>
        </div>
        <div className="photoCollections">
          {this.state.completePhotostream.map((photoAlbumb,index) => { 
            return (
            <Card className="collection-card">
              <CardMedia
                className="collection-card-media"
                image={this.urlGenerator(photoAlbumb.farm, photoAlbumb.server,
                  photoAlbumb.id, photoAlbumb.secret,"q")}
                title={photoAlbumb.title}
              />
              {/* <Flickrimg farm={photoAlbumb.farm} server={photoAlbumb.server}
                id={photoAlbumb.id} secret={photoAlbumb.secret} title={photoAlbumb.title}
                size="q">
              </Flickrimg> */}
              <CardContent className="title-card">
                <Typography variant="title" >{photoAlbumb.title}</Typography>
              </CardContent>
            </Card>);
          })}
        </div>
        
      </div>
    );
  }
}

export default App;
