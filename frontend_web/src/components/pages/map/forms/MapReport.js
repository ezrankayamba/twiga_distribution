import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import { GOOGLE_API_KEY, BASE_URL } from "../../../../conf";

const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
};
class MapReport extends Component {
  constructor(props) {
    super(props);
    this.state = { position: props.position };
  }
  onMarkerClick(e) {
    console.log(e);
  }
  onInfoWindowClose(e) {
    console.log(e);
  }
  onMapClicked(mapProps, map, evt) {}
  render() {
    const { surveys, google } = this.props;
    const { position } = this.state;

    return (
      <Map
        google={google}
        zoom={6}
        initialCenter={{
          lat: -6.192,
          lng: 35.7699,
        }}
        containerStyle={containerStyle}
        onClick={this.onMapClicked.bind(this)}
      >
        {surveys.map((s) => {
          let arr = BASE_URL.split("/");
          let protocol = arr[0];
          let host = arr[2];
          let url = protocol + "//" + host;
          let icon = {
            url: `${url}${s.category.icon}`,
          };
          console.log(icon);

          return (
            <Marker
              key={s.id}
              onClick={this.onMarkerClick}
              position={s.location}
              title={s.name}
              icon={icon}
            />
          );
        })}

        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
            <h1>Name Here</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY,
})(MapReport);
