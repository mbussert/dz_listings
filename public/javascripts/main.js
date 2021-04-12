const editor = pell.init({
    element: document.getElementById('editor'),
    onChange: html => {
      document.getElementById('html-output').textContent = html
    },
    defaultParagraphSeparator: 'p',
    styleWithCSS: true,
    actions: [
      'bold',
      'underline',
      {
        name: 'italic',
        result: () => pell.exec('italic')
      },
      {
        name: 'backColor',
        icon: '<div style="background-color:pink;">A</div>',
        title: 'Highlight Color',
        result: () => pell.exec('backColor', 'pink')
      },
      {
        name: 'image',
        result: () => {
          const url = window.prompt('Enter the image URL')
          if (url) pell.exec('insertImage', url)
        }
      },
      {
        name: 'link',
        result: () => {
          const url = window.prompt('Enter the link URL')
          if (url) pell.exec('createLink', url)
        }
      }
    ],
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