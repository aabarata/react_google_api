import React, { Component } from 'react';
import { connect } from 'react-redux';
import M from "materialize-css";
import { store as notificationService } from 'react-notifications-component';
import { setCoordinates } from '../../state/actions'
import { getSanitizedAddress } from '../../helpers/tools';
import 'materialize-css/dist/css/materialize.min.css';
import './form.css';

class FormWrapper extends Component {
    constructor() {
        super();
        this.state = {
            form: {
                title: '',
                start_date: '',
                description: '',
                remuneration: '',
                address: '',
                postal_code: '',
                region: '',
                country: '',
            },
            coordinates: {},
            hasGeoLocalization: false,
        };
    }
    componentDidMount() {
        // datepicker initialize
        var datepicker = document.querySelectorAll('.datepicker');
        M.Datepicker.init(datepicker, {
            format: 'dd/mmm/yyyy',
            onSelect: (date) => {
                this.setState({
                    form: {
                        ...this.state.form,
                        start_date: date
                    }
                });
            }
        });
        // google autocomplete initialize
        const { google } = this.props;
        const autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'), { types: ['geocode'] });
        autocomplete.setFields(['address_components', 'formatted_address', 'geometry']);
        autocomplete.addListener('place_changed', this.handlePlaceSelect.bind(this, autocomplete));
        // verify state of geolocation
        if (navigator.geolocation) {
            const self = this;
            navigator.geolocation.getCurrentPosition(() => {
                self.setState({
                    hasGeoLocalization: true
                });
            });
        }

    }
    handleInputChange(event) {
        this.setState({
            form: {
                ...this.state.form,
                [event.target.id]: event.target.value
            }
        });
    }
    handleAddressChange(event) {
        if (this.state.form.country === '') {
            this.handleInputChange(event);
        } else {
            this.setState({
                form: {
                    ...this.state.form,
                    address: '',
                    postal_code: '',
                    region: '',
                    country: ''
                }
            });
            // small trick to reboot google autocomplete
            const target = event.target;
            target.blur();
            setTimeout(() => {
                target.focus();
            }, 10);
        }
    }
    handleAutoPlaceSelect() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { google } = this.props;
                const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                new google.maps.Geocoder().geocode({ 'latLng': latlng }, (results, status) => {
                    if (status === 'OK') {
                        const sanitizedAddress = getSanitizedAddress(results[0]);
                        this.setAddressState(results[0].formatted_address, sanitizedAddress);
                    }
                })
            });
        }
    }
    handlePlaceSelect(autocomplete) {
        const addressObject = autocomplete.getPlace();
        const sanitizedAddress = getSanitizedAddress(addressObject);
        this.setAddressState(addressObject.formatted_address, sanitizedAddress);
    }
    setAddressState(formatted_address, sanitizedAddress) {
        this.setState({
            form: {
                ...this.state.form,
                address: formatted_address,
                postal_code: sanitizedAddress.postal_code,
                region: sanitizedAddress.region,
                country: sanitizedAddress.country
            },
            coordinates: { lat: sanitizedAddress.lat, lng: sanitizedAddress.lng }
        });
        this.props.dispatch(setCoordinates(this.state.coordinates));
    }
    handleResetForm() {
        this.setState({
            form: {
                title: '',
                start_date: '',
                description: '',
                remuneration: '',
                address: '',
                postal_code: '',
                region: '',
                country: '',
            },
            coordinates: {}
        });
        document.getElementById('start_date').value = '';
    }
    isFormValid() {
        const keys = Object.keys(this.state.form).filter(key => key !== 'postal_code' && key !== 'region');
        const isInvalid = keys.some(key => this.state.form[key] === '');
        return !isInvalid;
    }
    handleFormSubmit() {
        notificationService.addNotification({
            title: "Bravo !",
            message: "La campagne " + this.state.form.title + " a été bien créée",
            type: "success",
            insert: "top",
            container: "bottom-center",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 3000,
                onScreen: true
            },
            onRemoval: () => {
                this.handleResetForm();
            }
        });
    }
    render() {
        return (
            <form className="col s12">
                <div className="row">
                    <div className="col s12">
                        <h5>Insert your campaign</h5>
                    </div>
                    <div className="input-field col s12">
                        <input placeholder="Insert the campaign title" id="title" type="text" className="validate" value={this.state.form.title} onChange={this.handleInputChange.bind(this)}/>
                        <label htmlFor="title" className="active">Title<span className="required"> *</span></label>
                    </div>
                    <div className="input-field col s12">
                        <input placeholder="Insert the start date" id="start_date" type="text" className="datepicker"/>
                        <label htmlFor="start_date" className="active">Start date<span className="required"> *</span></label>
                    </div>
                    <div className="input-field col s12">
                        <textarea placeholder="Insert the description" id="description" className="materialize-textarea" value={this.state.form.description} onChange={this.handleInputChange.bind(this)}></textarea>
                        <label htmlFor="description" className="active">Description<span className="required"> *</span></label>
                    </div>
                    <div className="input-field col s12">
                        <input placeholder="Insert the remuneration" id="remuneration" type="number" className="validate" value={this.state.form.remuneration} onChange={this.handleInputChange.bind(this)}/>
                        <label htmlFor="remuneration" className="active">Remuneration<span className="required"> *</span></label>
                    </div>
                    <div className="input-field col s8">
                        <input placeholder="Start typing to search" id="address" type="text" className="validate" value={this.state.form.address} onChange={this.handleAddressChange.bind(this)}/>
                        <label htmlFor="address" className="active">Address<span className="required"> *</span></label>
                    </div>
                    <div className="input-field col s4">
                        <button className={'waves-effect waves-light btn right' + (this.state.hasGeoLocalization ? '' : ' disabled')} type="button" onClick={this.handleAutoPlaceSelect.bind(this)}>
                            <i className="material-icons left">my_location</i>Get my location
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s4">
                        <input placeholder="Ex. 70001 " id="postal_code" type="text" className="validate" value={this.state.form.postal_code} readOnly />
                        <label htmlFor="postal_code" className="active">Postal code</label>
                    </div>
                    <div className="input-field col s4">
                        <input placeholder="Ex. Ile de France" id="region" type="text" className="validate" value={this.state.form.region} readOnly />
                        <label htmlFor="region" className="active">Region</label>
                    </div>
                    <div className="input-field col s4">
                        <input placeholder="Ex. France" id="country" type="text" className="validate" value={this.state.form.country} readOnly />
                        <label htmlFor="country" className="active">Country</label>
                    </div>
                </div>
                <div className="row form_footer">
                    <div className="col l3 m4 s5 offset-l7 offset-m5 offset-s3">
                        <button className={'btn waves-effect waves-light right' + (this.isFormValid() ? '' : ' disabled')} type="button" name="action" onClick={this.handleFormSubmit.bind(this)}>Create
                            <i className="material-icons right">send</i>
                        </button>
                    </div>
                    <div className="col l2 m3 s4">
                        <button className="btn waves-effect waves-light right reset" type="button" onClick={this.handleResetForm.bind(this)}>
                            <i className="material-icons left">delete</i>Reset
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

export default connect()(FormWrapper);