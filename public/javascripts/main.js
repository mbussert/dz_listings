// console.log(`Section: ${section}`)
// console.log(`Successes: ${successes}`)
// console.log(`Errors: ${errors}`)
// console.log(`Latitude: ${lat_}`)
// console.log(`Longitude: ${lng_}`)
// Helpers

if (!window.LIS) {
  LIS = {
    id: function(id) {
      return document.getElementById(id);
    },
  };
}

/**
 * remove element by Id
 * @param {number} id
 */
function remove(id) {
  document.getElementById(id).parentNode.removeChild(document.getElementById(id));
}
// Language selector.
/**
 * Sets an attribute 'lang' with node value
 * @param {dom} el dom element
 */
// function langChange(el) {
//   document.body.setAttribute('lang', el.value);
// }

/**
 * Loads an image to be uploaded on browser
 * @param {event} event
 */
const loadFile = function(event) {
  const image = LIS.id('output');
  image.src = URL.createObjectURL(event.target.files[0]);
};

if (document.querySelector('.row .col p')) {
  try {
    const h = holmes({
      input: '.search input',
      find: '.col.listing',
      placeholder: '<h3>— No results, my dear Watson. —</h3>',
      mark: false,
      hiddenAttr: true,
      class: {
        visible: 'visible',
        hidden: 'hidden',
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
      },
    });
  } catch (error) {
    console.log('Maybe running where there is no list in HTML | ERROR: ', error.message);
  }
}


const options = {
  classname: 'toast',
  transition: 'fade',
  insertBefore: true,
  duration: 4000,
  enableSounds: true,
  autoClose: false,
  progressBar: true,
  sounds: {
    info: '/sounds/info/1.mp3',
    success: '/sounds/success/1.mp3',
    warning: '/sounds/warning/1.mp3',
    error: '/sounds/error/1.mp3',
  },
  onShow: function(type) { },
  onHide: function(type) { },
  prependTo: document.body.childNodes[0],
};
const toast = new Toasty(options);
errors.forEach((error) => {
  toast.error(error);
});
successes.forEach((success) => {
  toast.success(success);
});

/**
 * Easy strip Html using browser capability.
 * @param {string} html any html code.
 * @returns {string} stripped string from html tags.
 */
function stripHtml(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// on succeeds on pages with `editor` and `html-output` and other inputs
try {
  const editor = pell.init({
    element: LIS.id('editor'),
    onChange: (html) => {
      LIS.id('html-output').textContent = html;
      const raw = stripHtml(html);
      const charactersLeft = 200 - raw.length;
      const count = LIS.id('characters-left');
      count.innerHTML = 'Characters left: ' + charactersLeft;
      document.querySelectorAll('.add#description')[0].value = (html);
    },
    classes: {
      actionbar: 'pell-actionbar',
      button: 'pell-button',
      content: 'pell-content',
      selected: 'pell-button-selected',
    },
  });
  // editor.content<HTMLElement>
  // To change the editor's content:
  editor.content.innerHTML = '';
} catch (error) {
  console.log('Maybe running where pen is not in HTML | ERROR: ', error.message);
}

// TODO: if not found
// The DOM element you wish to replace with Tagify
const inputTags = document.querySelector('#donations');
const inputTags2 = document.querySelector('#artworks');

if (inputTags) {
  fetch('/listings/get_tags_lite_ar')
      .then((res) => res.json())
      .then((tags) => {
        // initialize Tagify on the above input node reference
        new Tagify(inputTags, {
          // Validate typed tag(s) by Regex. Here maximum chars length is defined as "10"
          pattern: /^.{0,20}$/,
          // add new tags when a comma or a space character is entered
          delimiters: ',| ',
          // do not remove invalid tags (but keep them marked as invalid)
          keepInvalidTags: false,
          editTags: {
            clicks: 1, // single click to edit a tag
            keepInvalid: true, // if after editing, tag is invalid, auto-revert
          },
          maxTags: 3,
          whitelist: tags.tags,
          transformTag: transformTag,
          backspace: 'edit',
          placeholder: 'Type something',
          dropdown: {
            // show suggestion after 1 typed character
            enabled: 1,
            // match only suggestions that starts with the typed characters
            fuzzySearch: true,
            // position suggestions list next to typed text
            position: 'text',
            // allow adding duplicate items if their case is different
            caseSensitive: true,
          },
          templates: {
            dropdownItemNoMatch: function(data) {
              return `No suggestion found for: ${data.value}`;
            },
          },
        });
      })
      .catch((err) => {
        throw err;
      });
}

if (inputTags2) {
  new Tagify(inputTags2, {
    // Validate typed tag(s) by Regex. Here maximum chars length is defined as "10"
    pattern: /^.{0,20}$/,
    // add new tags when a comma or a space character is entered
    delimiters: ',| ',
    // do not remove invalid tags (but keep them marked as invalid)
    keepInvalidTags: false,
    editTags: {
      clicks: 1, // single click to edit a tag
      keepInvalid: true, // if after editing, tag is invalid, auto-revert
    },
    maxTags: 1,
    whitelist: ['drawing', 'web design', 'interior design', 'sculpture', 'photography'],
    transformTag: transformTag,
    backspace: 'edit',
    placeholder: 'Type something',
    dropdown: {
      enabled: 1, // show suggestion after 1 typed character
      fuzzySearch: true, // match only suggestions that starts with the typed characters
      position: 'text', // position suggestions list next to typed text
      caseSensitive: true, // allow adding duplicate items if their case is different
    },
    templates: {
      dropdownItemNoMatch: function(data) {
        return `No suggestion found for: ${data.value}`;
      },
    },
  });
}

/**
 * blablabla (0_o)
 * @param {@@} tagData
 */
function transformTag(tagData) {
  tagData.style = '--tag-bg:' + stringToColour(tagData.value);
}

/**
 * A bijective String to color function
 * @param {string} str, ex: "hello"
 * @return {string} colour color code, ex: #00000
 */
function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let j = 0; j < 3; j++) {
    const value = (hash >> (j * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

// credits: https://github.com/turban/Leaflet.Mask
L.Mask = L.Polygon.extend({
  options: {
    stroke: false,
    color: '#333',
    fillOpacity: 0.5,
    clickable: true,

    outerBounds: new L.LatLngBounds([-90, -360], [90, 360]),
  },

  initialize: function(latLngs, options) {
    const outerBoundsLatLngs = [
      this.options.outerBounds.getSouthWest(),
      this.options.outerBounds.getNorthWest(),
      this.options.outerBounds.getNorthEast(),
      this.options.outerBounds.getSouthEast(),
    ];
    L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);
  },

});
L.mask = function(latLngs, options) {
  return new L.Mask(latLngs, options);
};

/**
 * Is marker (lat, lng) inside a polygon
 * @param {latlng} marker
 * @param {coordinates} vs
 * @return {boolean}
 */
function isMarkerInsidePolygon(marker, vs) {
  const x = marker.getLatLng().lat; const y = marker.getLatLng().lng;

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][1]; const yi = vs[i][0];
    const xj = vs[j][1]; const yj = vs[j][0];

    const intersect = ((yi > y) != (yj > y)) &&
         (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};

const lat = typeof lat_ !== 'undefined' ? lat_ : 36.75;
const lng = typeof lng_ !== 'undefined' ? lng_ : 3.05;
const latInput = LIS.id('lat');
const lngInput = LIS.id('lng');

if (latInput != null) {
  latInput.value = lat;
  lngInput.value = lng;
}

const zoom = 8;

const map = new L.Map('map');

const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttrib = 'Map data &copy; OpenStreetMap contributors';
const osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 10, attribution: osmAttrib});
map.addLayer(osm);

map.setView(new L.LatLng(lat, lng), zoom);

// transform geojson coordinates into an array of L.LatLng
const coordinates = dzBorders.features[0].geometry.coordinates[0];
const latLngs = [];
for (i = 0; i < coordinates.length; i++) {
  latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
}
L.mask(latLngs).addTo(map);

const polygon = dzStates.features.map((a)=> a.geometry.coordinates[0]);
const names = dzStates.features.map((a)=> a.properties.name);
const circle = L.circle([lat, lng], 6000).addTo(map);
let lastValid = [lat, lng];

/**
 * Attach one marker to map with constraints (marker is draggble but cannot go out of )
 * Based on dzBorders and dzStates (country borders and Wilayas delimitations)
 * @param {map} map
 * @param {marker} marker
 * @return {marker} Just a reference
 */
function moveableMarker(map, marker) {
  /**
 * blablabla (0_o)
 * @param {@@} evt
 */
  function trackCursor(evt) {
    marker.setLatLng(evt.latlng);
  }

  marker.on('mousedown', () => {
    map.dragging.disable();
    map.on('mousemove', trackCursor);
  });

  marker.on('mouseup', () => {
    map.dragging.enable();
    map.off('mousemove', trackCursor);
    const where = polygon.findIndex((coo) => isMarkerInsidePolygon(circle, coo));
    console.log(names[where]);
    if (isMarkerInsidePolygon(circle, coordinates)) {
      const center = circle.getBounds().getCenter();
      LIS.id('lat').value = center.lat;
      LIS.id('lng').value = center.lng;
      lastValid = [center.lat, center.lng];
    } else {
      marker.setLatLng(lastValid);
    }
  });

  return marker;
}

const moveable = moveableMarker(map, circle);

// Refrech tiles after some time
// because it doesn't load properly at first
setTimeout(() => {
  map.invalidateSize();
}, 3000);


// Define the modal (for the image onclick) behaviour
const modal = LIS.id('myModal');
// Get the image and insert it inside the modal - use its "alt" text as a caption
const img = LIS.id('imgg');
if (img) {
  const modalImg = LIS.id('img01');
  const captionText = LIS.id('caption');
  img.onclick = function() {
    modal.style.display = 'block';
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  };

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = 'none';
  };
}
