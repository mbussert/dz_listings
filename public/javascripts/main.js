function stripHtml(html) {
  let tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

const editor = pell.init({
  element: document.getElementById('editor'),
  onChange: html => {
    document.getElementById('html-output').textContent = html
    document.querySelectorAll('.add#description2')[0].value = stripHtml(html)
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

// The DOM element you wish to replace with Tagify
var inputTags = document.querySelector('input[name=tags]');

// initialize Tagify on the above input node reference
new Tagify(inputTags)

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

var toast = new Toasty(options);