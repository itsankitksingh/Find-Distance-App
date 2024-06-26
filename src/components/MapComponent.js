import React, { useEffect } from 'react';

const MapComponent = ({ loader, setMap, setOrigin, setStop, setDestination }) => {

  useEffect(() => {
    loader.load().then(() => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: { lat: 20.5937, lng: 78.9629 }, // India
      });

      setMap(map); // Save the map instance to state

      const autocompleteOrigin = new window.google.maps.places.Autocomplete(document.getElementById("origin"));
      const autocompleteStop = new window.google.maps.places.Autocomplete(document.getElementById("stop"));
      const autocompleteDestination = new window.google.maps.places.Autocomplete(document.getElementById("destination"));

      autocompleteOrigin.addListener('place_changed', () => {
        const place = autocompleteOrigin.getPlace();
        setOrigin(place.formatted_address);
      });

      autocompleteStop.addListener('place_changed', () => {
        const place = autocompleteStop.getPlace();
        setStop(place.formatted_address);
      });

      autocompleteDestination.addListener('place_changed', () => {
        const place = autocompleteDestination.getPlace();
        setDestination(place.formatted_address);
      });
    });
  }, [loader, setMap, setOrigin, setStop, setDestination]);

  return <section id="map" className="h-[32rem] w-[35rem]"></section>;
};

export default MapComponent;
