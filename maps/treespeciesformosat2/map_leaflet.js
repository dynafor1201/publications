var listOfSpecies = ['Silver birch','Oak','Red oak','Douglas fir','Eucalyptus','European Ash','Aspen','Corsican pine','Maritime pine','Black pine','Black locust','Silver fir','Willow']
var colorOfSpecies = ["#d7d79e", "#267300", "#ff0000","#00a9e6","#d3ffbe","#4ce600","#e6e600","#a900e6","#e600a9","#005ce6","#784c0b","#00c5ff","#d1ff73"]
var newOrder = [0,1,2,6,5,10,12,4,7,8,9,11,3];
let map = L.map('map',{tap: !L.Browser.mobile}).setView([43.45,1.2],12);
var marker;

/* Dark basemap */
let url = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
var OSM = L.tileLayer(url, {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd'
}).addTo(map);
/**

**/

plotty.addColorScale("speciesMap", colorOfSpecies, [0,1/12,2/12,3/12,4/12,5/12,6/12,7/12,8/12,9/12,10/12,11/12,1]);

var speciesMap = L.leafletGeotiff(
        url='modal_species_4326.tif',
        options={band: 0,
            displayMin: 1,
            displayMax: 13,
            name: 'modal classification',
            colorScale: "speciesMap",
            clampLow: false,
            clampHigh: false,
            //vector:true,
        }
    ).addTo(map);


map.on('click', function(e) {
var ROI = speciesMap.getValueAtLatLng(e.latlng.lat,e.latlng.lng);

console.log(ROI)
if(ROI > 0)
{  console.log(listOfSpecies[ROI-1])
  var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(`Species : ${listOfSpecies[ROI-1]}`)
    .openOn(map);
}
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < newOrder.length; i++) {
        div.innerHTML +=
            '<i style="background-color:' + colorOfSpecies[newOrder[i]] + '"></i> ' + listOfSpecies[newOrder[i]] + '<br>';
    }

    return div;
};

legend.addTo(map);
L.control.scale().addTo(map);

/** map.scrollWheelZoom.disable(); **/

/** L.control.sideBySide(osmLayer,stamenLayer).addTo(map); **/
