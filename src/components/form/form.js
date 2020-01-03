import React, { Component } from 'react';
import Script from 'react-load-script';
import M from "materialize-css";
import { getSanitizedAddress } from '../../helpers/tools';
import 'materialize-css/dist/css/materialize.min.css';
import './form.css';

class FormWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autocompleteInstance: undefined,
            title: undefined,
            start_date: undefined,
            description: undefined,
            remuneration: undefined,
            address: undefined,
            postal_code: undefined,
            region: undefined,
            country: undefined
        };
    }
    componentDidMount() {
        var datepicker = document.querySelectorAll('.datepicker');
        M.Datepicker.init(datepicker, {
            format: 'dd/mmm/yyyy',
            onSelect: (date) => {
                this.setState({
                    start_date: date
                });
            }
        });
    }
    handleInputChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    handleScriptLoad = () => {
        /*global google*/ // To disable any eslint 'google not defined' errors
        this.setState({ autocompleteInstance: new google.maps.places.Autocomplete(document.getElementById('address'), { types: ['geocode'] }) });
        this.state.autocompleteInstance.setFields(['address_components', 'formatted_address', 'geometry']);
        this.state.autocompleteInstance.addListener('place_changed', this.handlePlaceSelect);
    }
    handlePlaceSelect = () => {
        const addressObject = this.state.autocompleteInstance.getPlace();
        const sanitizedAddress = getSanitizedAddress(addressObject);
        this.setState({
            address: addressObject.formatted_address,
            postal_code: sanitizedAddress.postal_code,
            region: sanitizedAddress.region,
            country: sanitizedAddress.country
        });
    }
    render() {
        return (
            <form className="col s12">
                <Script url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBoHs-DrVwsg64udOzz35agtE03WYeGxio&libraries=places" onLoad={this.handleScriptLoad} async defer/> 
                <div className="row">
                    <div className="input-field col s12">
                        <input placeholder="Insert the campaign title" id="title" type="text" className="validate" value={this.state.title} onChange={this.handleInputChange}/>
                        <label htmlFor="title">Title</label>
                    </div>
                    <div className="input-field col s12">
                        <input placeholder="Insert the start date" id="start_date" type="text" className="datepicker"/>
                        <label htmlFor="start_date">Start date</label>
                    </div>
                    <div className="input-field col s12">
                        <textarea placeholder="Insert the description" id="description" className="materialize-textarea" value={this.state.description} onChange={this.handleInputChange}></textarea>
                        <label htmlFor="description">Description</label>
                    </div>
                    <div className="input-field col s12">
                        <input placeholder="Insert the remuneration" id="remuneration" type="number" className="validate" value={this.state.remuneration} onChange={this.handleInputChange}/>
                        <label htmlFor="remuneration">Remuneration</label>
                    </div>
                    <div className="input-field col s12">
                        <input placeholder="Start typing to search" id="address" type="text" className="validate" value={this.state.address} onChange={this.handleInputChange}/>
                        <label htmlFor="address">Address</label>
                    </div>
                    <div className="input-field col s4">
                        <input placeholder="Ex. 70001 " id="postal_code" type="text" className="validate" value={this.state.postal_code} onChange={this.handleInputChange}/>
                        <label htmlFor="postal_code">Postal code</label>
                    </div>
                    <div className="input-field col s4">
                        <input placeholder="Ex. Ile de France" id="region" type="text" className="validate" value={this.state.region} onChange={this.handleInputChange}/>
                        <label htmlFor="region">Region</label>
                    </div>
                    <div className="input-field col s4">
                        <input placeholder="Ex. France" id="country" type="text" className="validate" value={this.state.country} onChange={this.handleInputChange}/>
                        <label htmlFor="country">Country</label>
                    </div>
                </div>
            </form>
        );
    }
}

export default FormWrapper;