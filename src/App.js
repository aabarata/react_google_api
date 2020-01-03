import React from 'react';
import MapWrapper from './components/map/map';
import FormWrapper from './components/form/form';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';

function App() {
  return (
      <div className="App">
          <div className="row">
              <div className="noPadding col s12 l6">
                  <MapWrapper></MapWrapper>
              </div>
              <div className="col s12 l6">
                  <FormWrapper></FormWrapper>
              </div>
          </div>
    </div>
  );
}

export default App;
