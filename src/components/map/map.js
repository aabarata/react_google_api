import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Map, Marker } from 'google-maps-react';
import { getCoordinates } from '../../state/selectors'
import './map.css';

const INITIAL_COORDS = {
    lat: 48.854563,
    lng: 2.347640
};

// Using react hooks
 const MapWrapper = (props) => {
    const [coordinates, setCoordinates] = useState({
        lat: INITIAL_COORDS.lat,
        lng: INITIAL_COORDS.lng
    });
     useEffect(() => {
         if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition((position) => {
                 setCoordinates({
                     lat: position.coords.latitude,
                     lng: position.coords.longitude
                 });
             });
         }
     });
    return (
        <div className="wrapper">
            <Map
                google={props.google}
                zoom={props.coordinates ? 16 : 10}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                center={ props.coordinates ? props.coordinates : coordinates}
            >
                {
                    props.coordinates ? (<Marker position={props.coordinates} />) : null
                }
            </Map>
        </div>
    );

}

export default connect(getCoordinates)(MapWrapper);