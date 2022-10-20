let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2022-10-13%2000:00:00&endtime=2022-10-20%2023:59:59&minmagnitude=2.5&orderby=time"

d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {
    // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, time and magnitude of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><br>Magnitude: ${feature.properties.mag}`);
  }



 // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: colours(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      // Creating a function to assign colours to different magnitudes.
      function colours(magnitude) {
        switch (true) {
        case magnitude > 5:
          return "red";
        case magnitude > 4:
          return "orange";
        case magnitude > 3:
          return "yellow";
        case magnitude > 2:
          return "cyan";
        }
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  
}

function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

 // Create a baseMaps object.
 let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

// Create an overlay object to hold our overlay.
let overlayMaps = {
    Earthquakes: earthquakes
  };

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  

// Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  /*Legend specific*/
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Magnitude</h4>";
  div.innerHTML += '<i style="background: red"></i><span>5+</span><br>';
  div.innerHTML += '<i style="background: orange"></i><span>4</span><br>';
  div.innerHTML += '<i style="background: yellow"></i><span>3</span><br>';
  div.innerHTML += '<i style="background: cyan"></i><span>2</span><br>';
 
  
  

  return div;
};

legend.addTo(myMap);
}




