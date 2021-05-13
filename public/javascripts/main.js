// console.log(`Section: ${section}`)
// console.log(`Successes: ${successes}`)
// console.log(`Errors: ${errors}`)
// console.log(`Latitude: ${lat_}`)
// console.log(`Longitude: ${lng_}`)

// Language selector.
function langChange(el) {
   document.body.setAttribute('lang', el.value);
}

var loadFile = function (event) {
   var image = document.getElementById('output');
   image.src = URL.createObjectURL(event.target.files[0]);
};

if (document.querySelector('.row .col p'))
   try {
      var h = holmes({
         input: '.search input',
         find: '.col.listing',
         placeholder: '<h3>— No results, my dear Watson. —</h3>',
         mark: false,
         hiddenAttr: true,
         class: {
            visible: 'visible',
            hidden: 'hidden'
         },
         onHidden(el) {
            console.log('hidden', el);
         },
         onFound(el) {
            console.log('found', el);
         },
         onInput(el) {
            console.log('input', el);
         },
         onVisible(el) {
            console.log('visible', el);
         },
         onEmpty(el) {
            console.log('empty', el);
         }
      });
   } catch (error) {
      console.log("Probably running where there is no list in HTML | ERROR: ", error.message)
   }


var options = {
   classname: "toast",
   transition: "fade",
   insertBefore: true,
   duration: 4000,
   enableSounds: true,
   autoClose: false,
   progressBar: true,
   sounds: {
      info: "/sounds/info/1.mp3",
      success: "/sounds/success/1.mp3",
      warning: "/sounds/warning/1.mp3",
      error: "/sounds/error/1.mp3",
   },

   onShow: function (type) { },

   onHide: function (type) { },

   prependTo: document.body.childNodes[0]
};


var toast = new Toasty(options);
errors.forEach(error => {
   toast.error(error)
});
successes.forEach(success => {
   toast.success(success)
});
function stripHtml(html) {
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

// on succeeds on pages with `editor` and `html-output` and other inputs
try {
   const editor = pell.init({
      element: document.getElementById('editor'),
      onChange: html => {
         document.getElementById('html-output').textContent = html
         var raw = stripHtml(html)
         var charactersLeft = 200 - raw.length;
         var count = document.getElementById('characters-left');
         count.innerHTML = "Characters left: " + charactersLeft;
         document.querySelectorAll('.add#description')[0].value = (html)

      },
      classes: {
         actionbar: 'pell-actionbar',
         button: 'pell-button',
         content: 'pell-content',
         selected: 'pell-button-selected'
      }
   })
   // editor.content<HTMLElement>
   // To change the editor's content:
   editor.content.innerHTML = '<b><u><i>Initial content!</i></u></b>'
} catch (error) {
   console.log("Probably running where pen is not in HTML | ERROR: ", error.message)
}

// TODO: if not found
// The DOM element you wish to replace with Tagify
var inputTags = document.querySelector('#donations');
var inputTags2 = document.querySelector('#artworks');

if (inputTags)
   fetch('/listings/get_tags_lite')
      .then(res => res.json())
      .then((tags) => {
         // initialize Tagify on the above input node reference
         new Tagify(inputTags, {
            pattern: /^.{0,20}$/,  // Validate typed tag(s) by Regex. Here maximum chars length is defined as "10"
            delimiters: ",| ",        // add new tags when a comma or a space character is entered
            keepInvalidTags: false,         // do not remove invalid tags (but keep them marked as invalid)
            editTags: {
               clicks: 1,              // single click to edit a tag
               keepInvalid: true      // if after editing, tag is invalid, auto-revert
            },
            maxTags: 3,
            whitelist: tags.tags,
            transformTag: transformTag,
            backspace: "edit",
            placeholder: "Type something",
            dropdown: {
               enabled: 1,            // show suggestion after 1 typed character
               fuzzySearch: true,    // match only suggestions that starts with the typed characters
               position: 'text',      // position suggestions list next to typed text
               caseSensitive: true,   // allow adding duplicate items if their case is different
            },
            templates: {
               dropdownItemNoMatch: function (data) {
                  return `No suggestion found for: ${data.value}`
               }
            }
         })
      })
      .catch(err => { throw err });

if (inputTags2)
   new Tagify(inputTags2, {
      pattern: /^.{0,20}$/,  // Validate typed tag(s) by Regex. Here maximum chars length is defined as "10"
      delimiters: ",| ",        // add new tags when a comma or a space character is entered
      keepInvalidTags: false,         // do not remove invalid tags (but keep them marked as invalid)
      editTags: {
         clicks: 1,              // single click to edit a tag
         keepInvalid: true      // if after editing, tag is invalid, auto-revert
      },
      maxTags: 1,
      whitelist: ['drawing', 'web design', 'interior design', 'sculpture', 'photography'],
      transformTag: transformTag,
      backspace: "edit",
      placeholder: "Type something",
      dropdown: {
         enabled: 1,            // show suggestion after 1 typed character
         fuzzySearch: true,    // match only suggestions that starts with the typed characters
         position: 'text',      // position suggestions list next to typed text
         caseSensitive: true,   // allow adding duplicate items if their case is different
      },
      templates: {
         dropdownItemNoMatch: function (data) {
            return `No suggestion found for: ${data.value}`
         }
      }
   })

function transformTag(tagData) {
   tagData.style = "--tag-bg:" + stringToColour(tagData.value);
}

function stringToColour(str) {
   var hash = 0;
   for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
   }
   var colour = '#';
   for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
   }
   return colour;
}

// credits: https://github.com/turban/Leaflet.Mask
// credits: https://github.com/turban/Leaflet.Mask
// credits: https://github.com/turban/Leaflet.Mask
// credits: https://github.com/turban/Leaflet.Mask
L.Mask = L.Polygon.extend({
   options: {
      stroke: false,
      color: '#333',
      fillOpacity: 0.5,
      clickable: true,

      outerBounds: new L.LatLngBounds([-90, -360], [90, 360])
   },

   initialize: function (latLngs, options) {

      var outerBoundsLatLngs = [
         this.options.outerBounds.getSouthWest(),
         this.options.outerBounds.getNorthWest(),
         this.options.outerBounds.getNorthEast(),
         this.options.outerBounds.getSouthEast()
      ];
      L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);
   },

});
L.mask = function (latLngs, options) {
   return new L.Mask(latLngs, options);
};

function isMarkerInsidePolygon(marker, vs) {
   var x = marker.getLatLng().lat, y = marker.getLatLng().lng;

   var inside = false;
   for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][1], yi = vs[i][0];
      var xj = vs[j][1], yj = vs[j][0];

      var intersect = ((yi > y) != (yj > y))
         && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
   }

   return inside;
};

var lat = typeof lat_ !== "undefined" ? lat_ : 36.75;
var lng = typeof lng_ !== "undefined" ? lng_ : 3.05;
var latInput = document.getElementById('lat')
var lngInput = document.getElementById('lng')

if (latInput != null) {
   latInput.value = lat;
   lngInput.value = lng;
}
// var sectionInput = document.getElementById('section')
// if (sectionInput != null) {

// }

var zoom = 8;

var map = new L.Map('map');

var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data &copy; OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, { minZoom: 5, maxZoom: 10, attribution: osmAttrib });
map.addLayer(osm);

map.setView(new L.LatLng(lat, lng), zoom);

// transform geojson coordinates into an array of L.LatLng
var coordinates = dz0.features[0].geometry.coordinates[0];
var latLngs = [];
for (i = 0; i < coordinates.length; i++) {
   latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
}
L.mask(latLngs).addTo(map);

var polygon = dz.features.map(a=> a.geometry.coordinates[0])
var names = dz.features.map(a=> a.properties.name)
// map.on('click', addMarker);
var circle = L.circle([lat, lng], 6000).addTo(map);
var lastValid = [lat, lng]
function moveableMarker(map, marker) {
   function trackCursor(evt) {
      marker.setLatLng(evt.latlng)
   }

   marker.on("mousedown", () => {
      map.dragging.disable()
      map.on("mousemove", trackCursor)
   })

   marker.on("mouseup", () => {
      map.dragging.enable()
      map.off("mousemove", trackCursor)
      var where = polygon.findIndex(coo => isMarkerInsidePolygon(circle, coo))
      console.log(names[where])
      if (isMarkerInsidePolygon(circle, coordinates)) {
         var center = circle.getBounds().getCenter()
         document.getElementById('lat').value = center.lat;
         document.getElementById('lng').value = center.lng;
         lastValid = [center.lat, center.lng]
      } else {
         marker.setLatLng(lastValid)
      }


   })

   return marker
}

const moveable = moveableMarker(map, circle);


// map.on('mouseup', function (e) {
//    map.removeEventListener('mousemove');
// })

setTimeout(() => {
   map.invalidateSize();
}, 3000);

function addMarker(e) {
   // Add marker to map at click location; add popup window
   var newMarker = new L.marker(e.latlng).addTo(map);
}

// Get the modal
var modal = document.getElementById("myModal");
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("imgg");
if (img) {
   var modalImg = document.getElementById("img01");
   var captionText = document.getElementById("caption");
   img.onclick = function () {
      modal.style.display = "block";
      modalImg.src = this.src;
      captionText.innerHTML = this.alt;
   }

   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];

   // When the user clicks on <span> (x), close the modal
   span.onclick = function () {
      modal.style.display = "none";
   }
}