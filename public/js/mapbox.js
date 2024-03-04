


export const displayMap=(locations)=> {
  
  
  length = locations.length;
let coord =locations[0].coordinates;

async function initMap() {
// Request needed libraries.
const { Map, InfoWindow } = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
var myLatlng = new google.maps.LatLng(coord[1],coord[0]);

var mapOptions = {
  zoom: 3,
  center:myLatlng,
  mapTypeId: 'roadmap',
  mapId: "4504f8b37365c3d0",
  // zoomControl: false,
scaleControl: false,
scrollwheel: false,
  
};

var map = new google.maps.Map(document.getElementById('map'),
    mapOptions);
var bounds = new google.maps.LatLngBounds();
    locations.forEach(loc => {
      
    
  
    const el = document.createElement("div");

    el.className = 'marker';
  
    const myLatlng=new google.maps.LatLng(loc.coordinates[1],loc.coordinates[0]);
    const contentString=`<div class="popup">Day ${loc.day} : ${loc.description}</div>`;
    const infowindow = new google.maps.InfoWindow({
    content:contentString,
}); 

  

    const marker = new AdvancedMarkerElement({
    
      map,
      position: myLatlng, 
      title:`Day ${loc.day} : ${loc.description}`,
      
    content :el
    });
  
  
    
    marker.setMap(map);
    infowindow.open({
    anchor: marker,
    map,
  });
  bounds.extend(myLatlng);
  })
    map.fitBounds(bounds,{
      top:200,
      bottom:150,
      left:100,
      right:100
      });
  };


  
window.onload=initMap();}