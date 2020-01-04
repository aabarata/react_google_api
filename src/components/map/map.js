import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, Marker } from 'google-maps-react';
import { getCoordinates } from '../../state/selectors'
import './map.css';

const INITIAL_COORDS = {
    lat: 48.854563,
    lng: 2.347640
};

class MapWrapper extends Component {
    constructor() {
        super();
        this.state = {
            lat: INITIAL_COORDS.lat,
            lng: INITIAL_COORDS.lng
        }
    }
    componentDidMount() {
        if (navigator.geolocation) {
            const self = this;
            navigator.geolocation.getCurrentPosition((position) => {
                self.setState({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
    }
    render() {
        return (
            <div className="wrapper">
                <Map
                    google={this.props.google}
                    zoom={this.props.coordinates.lat ? 16 : 10}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    initialCenter={this.state}
                    center={this.props.coordinates}
                >
                    <Marker position={this.props.coordinates} />
                </Map>
            </div>
        );
    }
}

export default connect(getCoordinates)(MapWrapper);