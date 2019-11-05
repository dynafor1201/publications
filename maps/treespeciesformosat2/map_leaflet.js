var listOfSpecies = ['Silver birch','Oak','Red oak','Douglas fir','Eucalyptus','European Ash','Aspen','Corsican pine','Maritime pine','Black pine','Black locust','Silver fir','Willow']
var colorOfSpecies = ["#d7d79e", "#267300", "#ff0000","#00a9e6","#d3ffbe","#4ce600","#e6e600","#a900e6","#e600a9","#005ce6","#784c0b","#00c5ff","#d1ff73"]
var newOrder = [0,1,2,6,5,10,12,4,7,8,9,11,3];
var colorMap = values => values[0] === 0 ? null :
									(values[0] > 0 && values[0] <= 1) ? colorOfSpecies[0]:
									(values[0] > 1 && values[0] <= 2) ? colorOfSpecies[1]:
									(values[0] > 2 && values[0] <= 3) ? colorOfSpecies[2]:
									(values[0] > 3 && values[0] <= 4) ? colorOfSpecies[3]:
									(values[0] > 4 && values[0] <= 5) ? colorOfSpecies[4]:
									(values[0] > 5 && values[0] <= 6) ? colorOfSpecies[5]:
									(values[0] > 6 && values[0] <= 7) ? colorOfSpecies[6]:
									(values[0] > 7 && values[0] <= 8) ? colorOfSpecies[7]:
									(values[0] > 7 && values[0] <= 9) ? colorOfSpecies[8]:
									(values[0] > 7 && values[0] <= 10) ? colorOfSpecies[9]:
									(values[0] > 7 && values[0] <= 11) ? colorOfSpecies[10]:
									(values[0] > 7 && values[0] <= 12) ? colorOfSpecies[11]:
									(values[0] > 7 && values[0] <= 13) ? colorOfSpecies[12]:
									colorOfSpecies[13];
let map = L.map('map',{tap: !L.Browser.mobile}).setView([43.45,1.08],12);

let url = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';

var OSM = L.tileLayer(url, {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd'
}).addTo(map);

var GeoportailFrance_orthos = L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
	attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
	bounds: [[-75, -180], [81, 180]],
	minZoom: 2,
	maxZoom: 19,
	apikey: 'choisirgeoportail',
	format: 'image/jpeg',
	style: 'normal',
  opacity : 1,
}).addTo(map);

var url_to_geotiff_file = "modal_species_4326.tif";

var speciesMap = fetch(url_to_geotiff_file)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {

      var layer = new GeoRasterLayer({
          georaster: georaster,
          pixelValuesToColorFn: colorMap,
          resolution:256
      });

      layer.addTo(map)

      //map.fitBounds(layer.getBounds());

      map.on('click', function(evt) {
      var latlng = map.mouseEventToLatLng(evt.originalEvent);
      ROI = geoblaze.identify(georaster, [latlng.lng, latlng.lat]);

      if(ROI > 0)
            {
                var popup = L.popup()
                .setLatLng(evt.latlng)
                .setContent(`Species : ${listOfSpecies[ROI-1]}`)
                .openOn(map);
						}
      });
  	sideBySide = L.control.sideBySide(GeoportailFrance_orthos,layer);
		sideBySide.addTo(map);
  });
});

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (speciesMap) {
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
