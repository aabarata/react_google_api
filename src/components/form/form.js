import React, { Component } from 'react';
import { connect } from 'react-redux';
import M from "materialize-css";
import { setCoordinates } from '../../state/actions'
import { getSanitizedAddress } from '../../helpers/tools';
import 'materialize-css/dist/css/materialize.min.css';
import './form.css';

class FormWrapper extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            start_date: '',
            description: '',
            remuneration: '',
            address: '',
            postal_code: '',
            region: '',
            country: ''
        };
    }
    componentDidMount() {
        // datepicker initialize
        var datepicker = document.querySelectorAll('.datepicker');
        M.Datepicker.init(datepicker, {
            format: 'dd/mmm/yyyy',
            onSelect: (date) => {
                this.setState({
                    start_date: date
                });
            }
        });
        // google autocomplete initialize
        const { google } = this.props;
        const autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'), { types: ['geocode'] });
        autocomplete.setFields(['address_components', 'formatted_address', 'geometry']);
        autocomplete.addListener('place_changed', this.handlePlaceSelect.bind(this, autocomplete));
    }
    handleInputChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    handlePlaceSelect(autocomplete) {
        const addressObject = autocomplete.getPlace();
        const sanitizedAddress = getSanitizedAddress(addressObject);
        this.setState({
            address: addressObject.formatted_address,
            postal_code: sanitizedAddress.postal_code,
            region: sanitizedAddress.region,
            country: sanitizedAddress.country
        });
        this.props.dispatch(
            setCoordinates({ lat: sanitizedAddress.lat, lng: sanitizedAddress.lng })
        );
    }
    render() {
        return (
            <form className="col s12">
                <div className="row">
                    <div className="input-field col s12">
                        <input placeholder="Insert the campaign title" id="title" type="text" className="validate" value={this.state.title} onChange={this.handleInputChange.bind(this)}/>
                        <label htmlFor="title" className="active">Title</label>
                    </div>
                    <div className="input-field col s12">
                        <input placeholder="Insert the start date" id="start_date" type="text" className="datepicker"/>
                        <label htmlFor="start_date" className="active">Start date</label>
                    </div>
                    <div className="input-field col s12">
                        <textarea placeholder="Insert the description" id="description" className="materialize-textarea" value={this.state.description} onChange={this.handleInputChange.bind(this)}></textarea>
                        <label htmlFor="description" className="active">Description</label>
                    </div>
                    <div className="input-field col s12">
                        <input placeholder="Insert the remuneration" id="remuneration" type="number" className="validate" value={this.state.remuneration} onChange={this.handleInputChange.bind(this)}/>
                        <label htmlFor="remuneration" className="active">Remuneration</label>
                    </div>
                    <div className="input-field col s12">
                        <input placeholder="Start typing to search" id="address" type="text" className="validate"/>
                        <label htmlFor="address" className="active">Address</label>
                    </div>
                    <div className="input-field col s4">
                        <input placeholder="Ex. 70001 " id="postal_code" type="text" className="validate" value={this.state.postal_code} readOnly />
                        <label htmlFor="postal_code" className="active">Postal code</label>
                    </div>
                    <div className="input-field col s4">
                        <input placeholder="Ex. Ile de France" id="region" type="text" className="validate" value={this.state.region} readOnly/>
                        <label htmlFor="region" className="active">Region</label>
                    </div>
                    <div className="input-field col s4">
                        <input placeholder="Ex. France" id="country" type="text" className="validate" value={this.state.country} readOnly />
                        <label htmlFor="country" className="active">Country</label>
                    </div>
                </div>
            </form>
        );
    }
}

export default connect()(FormWrapper);