import React, { Component }  from 'react';
import MapWrapper from './components/map/map';
import FormWrapper from './components/form/form';
import { GoogleApiWrapper } from 'google-maps-react';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="row">
                    <div className="noPadding col s12 l6">
                        <MapWrapper google={this.props.google}></MapWrapper>
                    </div>
                    <div className="col s12 l6">
                        <FormWrapper google={this.props.google}></FormWrapper>
                    </div>
                </div>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyBoHs-DrVwsg64udOzz35agtE03WYeGxio"
})(App);
