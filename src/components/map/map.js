import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import './map.css';

const DUMMY_CORDS = {
    lat: 48.834100,
    lng: 2.371364
};

class MapWrapper extends Component {
    render() {
        return (
            <div className="wrapper">
                <Map
                    google={this.props.google}
                    zoom={16}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    initialCenter={DUMMY_CORDS}
                >
                    <Marker position={DUMMY_CORDS} />
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyBoHs-DrVwsg64udOzz35agtE03WYeGxio"
})(MapWrapper);