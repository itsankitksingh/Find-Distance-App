import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.png';
import originLogoImg from './assets/originLogo.png';
import stopLogoImg from './assets/stopLogo.png';
import plusCircleImg from './assets/plus-circle.png';
import destLogoImg from './assets/destinationLogo.png';
import { Loader } from '@googlemaps/js-api-loader';
import MapComponent from './components/MapComponent';

const GOOGLE_MAPS_API_KEY = "AIzaSyBuTFtFl1QChkGkKQZROvaYqVzkOEKXv5M";

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
  version: "weekly",
});

function App() {
  const [originInput, setOriginInput] = useState("");
  const [stopInput, setStopInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [distance, setDistance] = useState("-- kms");
  const [waypoints, setWaypoints] = useState([]);
  const [map, setMap] = useState(null);

  const addStop = () => {
    if (stopInput) {
      setWaypoints([...waypoints, stopInput]);
      setStopInput("");
    } else {
      alert("Please enter a valid stop.");
    }
  };

  const calculateDistance = () => {
    if (!originInput || !destinationInput) {
      alert("Origin and Destination are required!");
      return;
    }

    loader.load().then(() => {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
      });

      const directionsRequest = {
        origin: originInput,
        destination: destinationInput,
        travelMode: 'DRIVING',
        waypoints: waypoints.map(stop => ({ location: stop, stopover: true })),
      };

      directionsService.route(directionsRequest)
        .then((response) => {
          directionsRenderer.setDirections(response);

          const route = response.routes[0];
          let totalDistance = 0;

          route.legs.forEach((leg) => {
            totalDistance += leg.distance.value; 
          });

          setDistance((totalDistance / 1000).toFixed(2) + " kms"); 
        })
        .catch((e) => window.alert("Could not display directions due to: " + e));
    });
  };

  return (
    <div className='h-screen flex flex-col'>
      <header className='h-20 px-4 md:px-16 flex items-center'>
        <img className="logo w-32 h-14 md:w-40 md:h-[4.3rem]" src={logo} alt="Graviti logo"/>
      </header>
      <main className="App flex-1 bg-[#F4F8FA]">
        <h1 className='text-center py-4 font-work_sans text-[#1B31A8]'>Let's calculate <p className="inline font-bold">distance</p> from Google maps</h1>
        <section className='flex flex-col md:flex-row h-full w-full'>
          <section id="user-input" className="px-4 md:px-28 flex-1">
            <section id="inputs" className="flex flex-col md:flex-row justify-between items-center">
              <section id="details" className="flex flex-col gap-4 md:gap-6 w-full md:w-auto">
                <label className='flex flex-col'>
                  Origin
                  <div className='border flex items-center rounded-md border-[#E9EEF2] bg-white'>
                    <img className='h-4 w-4 p-1' src={originLogoImg} alt="origin logo"/>
                    <input className='w-full py-2 px-3' id="origin" type="text" placeholder='Enter a location' name="origin" value={originInput} onChange={(e) => setOriginInput(e.target.value)}/>  
                  </div>
                </label>
                <div className="flex flex-col">
                  <label className='flex flex-col'>
                    Stop
                    <div className='border flex items-center rounded-md border-[#E9EEF2] bg-white'>
                      <img className='h-4 w-4 p-1' src={stopLogoImg} alt="stop logo"/>
                      <input className='w-full py-2 px-3' id="stop" type="text" placeholder='Enter a location' name="stop" value={stopInput} onChange={(e) => setStopInput(e.target.value)}/>
                    </div>
                  </label>
                  <button id="add-stop" className="flex items-center justify-center mt-2 text-[#0079FF]" onClick={addStop}>
                    <img className="h-4 w-4 mr-1" src={plusCircleImg} alt="plus-circle with border" />
                    Add another stop
                  </button>
                </div>
                <label className='flex flex-col'>
                  Destination
                  <div className='border flex items-center rounded-md border-[#E9EEF2] bg-white'>
                    <img className='h-4 w-4 p-1' src={destLogoImg} alt="destination logo" />
                    <input className='w-full py-2 px-3' id="destination" type="text" placeholder='Enter a location' name="destination" value={destinationInput} onChange={(e) => setDestinationInput(e.target.value)}/>
                  </div>
                </label>
              </section>
              <button id='calculate' className='mt-4 md:mt-0 text-white w-full md:w-36 h-12 md:h-16 font-ibm_sans text-lg font-semibold rounded-[2rem] bg-[#1B31A8]' onClick={calculateDistance}>Calculate</button>
            </section>
            <section id="result" className='w-full md:w-[30.6rem] h-[9rem] rounded-lg overflow-hidden border border-[#E9EEF2] mt-6'>
              <div className='distance-container bg-white flex justify-between px-5 py-5'>
                <span className='text-xl font-bold'>Distance</span>
                <span id="distance" className='text-3xl font-bold text-[#0079FF]'>{distance}</span>
              </div>
              <h2 className='text-xs text-center px-5 py-5'>
                The distance between <span className='font-bold'>{originInput}</span> and <span className='font-bold'>{destinationInput}</span> via the selected route is <span className='font-bold'>{distance}</span>.
              </h2>
            </section>
          </section>
          <section className="flex-1">
            <MapComponent loader={loader} setMap={setMap} setOrigin={setOriginInput} setStop={setStopInput} setDestination={setDestinationInput} />
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
