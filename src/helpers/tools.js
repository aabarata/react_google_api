export function getSanitizedAddress(addressObject) {
    let sanitizedAddress = {
        postal_code: '',
        region: '',
        country: '',
        lat: 0,
        lng: 0
    };
    sanitizedAddress.lat = addressObject.geometry.location.lat();
    sanitizedAddress.lng = addressObject.geometry.location.lng();
    addressObject.address_components.forEach((item) => {
        if (item.types.includes('postal_code')) {
            sanitizedAddress.postal_code = item.long_name;
        }
        if (item.types.includes('administrative_area_level_1')) {
            sanitizedAddress.region = item.long_name;
        }
        if (item.types.includes('country')) {
            sanitizedAddress.country = item.long_name;
        }
    });
    return sanitizedAddress;
};