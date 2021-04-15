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


// The DOM element you wish to replace with Tagify
var inputTags = document.querySelector('input[name=tags]');

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
  whitelist: ["temple", "stun", "detective"],
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
      return `
            No suggestion found for: ${data.value}
        `
    }
  }
})

function transformTag( tagData ){
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

var options = {
  classname: "toast",
  transition: "fade",
  insertBefore: true,
  duration: 4000,
  enableSounds: true,
  autoClose: false,
  progressBar: true,
  sounds: {
    info: "../sounds/info/1.mp3",
    success: "../sounds/success/1.mp3",
    warning: "../sounds/warning/1.mp3",
    error: "../sounds/error/1.mp3",
  },

  onShow: function (type) { },

  onHide: function (type) { },

  prependTo: document.body.childNodes[0]
};