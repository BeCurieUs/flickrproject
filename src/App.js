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
//temperaraly have my own manual API key, will change to individual API key
// when I learn now to oAuth more

const api_secret = "5c9d856058d4cd88"

// same as above though not needed yet with current feature set


class App extends Component {

  state = {
    user_id : "11860006@N08",
    // manually have an ID for now, will be able to input one in time
    // obtaining your user id is not built into the app yet, has to be manually obtained from flickr
    printCollection : [],
    completePhotostream : [],
  }

  componentDidMount() {
    this.searchFlickr();
  }


  searchFlickr = () =>{
    // initial fetch uses the user id to grab all the photo lists (basically their named image gallaries)
    // This is an array of objects that contain information about the photo gallery (its id) and its default photo
    // and information about the list itself. This has page limits, will have to build in detection evetually
    // code now only operates correctly if all the information is on a single page
    fetch(`https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${myapi_key}&user_id=${this.state.user_id}&format=json&nojsoncallback=1`)
    .then(response => response.json())
    .then(data => {
      // console.log(JSON.stringify(data, null, 2))
      data.photosets.photoset.forEach( (photoCollection,index) => {
        // each photo gallery also has to be individually looked up for all the photos in that gallery
        // this is also page limited and only curretly works for lists that have one page of results (500)
        fetch(`https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${myapi_key}&photoset_id=${photoCollection.id}&format=json&nojsoncallback=1`)
        .then(innerResponse => innerResponse.json())
        .then(innerData => {
          // console.log(photoCollection.title._content)
          // console.log(innerData.photoset.photo)

          // complete photostream ends up housing an array of objects of galleries, one of the keys is the title
          // of the gallery, the other is the data needed to look up a picture link for the default picture
          // and the final key is an array of all of the pictures data for link lookup
          this.setState({
            completePhotostream : [...this.state.completePhotostream,{title : photoCollection.title._content, farm:photoCollection.farm, id:photoCollection.primary, server:photoCollection.server, secret:photoCollection.secret , photos : innerData.photoset.photo}]
          })
        })
      });
      // console.log(this.state.collectionsList)
      // this.printImageList(this.state.collectionsList)
    })
  }

  // might be obsolute, keeping around to copy past from

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

  // link truncation needed for picture link look up
  getSize = () =>{
    if(this.props.size!==undefined){
      return "_"+this.props.size
    }
    return "";
  }

  // had this as componet but ended up making it overly complicated.
  // flickr has a special way to look up links that involve all the data stored in the complete photo
  // stream array

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

// major functionality still missing. I want to be able to backup sometimes entire photo stream
// this is complicated because the current method I used to access images doesn't give me access
// to the orignials, I have to use a different API call now that I have the image IDs.

// I also haven't given a way to view a gallery, sort the galleries (flickr just blasts them out in any order)
// or to view individual images in a gallery. I want this ability so that people can select or deselect
// pictures to backup. 

export default App;
