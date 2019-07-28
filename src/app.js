import JSZip from 'jszip'

const pool = []

let stage, renderer, outline



new Vue({
  data: {
    color: '#000000',
    maxWidth: 100,
    size: 32,
    height: 48,
    spacing: 2,
    name: 'monospace',
    text: 'Hello\n你好',
    outline: false,
    last: {x: 0, y: 0, w: 0, h: 0}
  },

  watch: {
    outline(ok) {
      outline.visible = ok
    }
  },

  methods: {
    choose() {
      const input = document.createElement('input')
      input.type = 'file'
      input.onchange = () => {
        const reader = new FileReader()
        reader.readAsDataURL(input.files.item(0))
        reader.onload = () => {
          const style = document.createElement('style')

          this.name = 'custom'

          style.innerHTML = [
            '@font-face {',
            `src: url("${reader.result}");`,
            'font-family: custom;',
            '}',
            '#__preload {',
            'font-family: custom;',
            '}'
          ].join('\n')

          document.head.appendChild(style)

          // 否则字体无法立即生效
          // const p = document.createElement('p')
          // p.style.fontFamily = 'custom'
          // p.innerHTML = 'x'
          // p.style.visibility = 'hidden'
          // document.body.appendChild(p)
        }
      }
      input.click()
    },

    add() {
      this.render(this.text)
      this.text = ''
    },

    clean() {
      this.last.x =
      this.last.y =
      this.last.w =
      this.last.h = 0
      stage.removeChildren().forEach(child => {
        child.destroy()
      })
    },

    stroke() {
      outline.clear()
      outline.lineStyle(1, 0xff33cc)
      stage.children.forEach(child => {
        if (child instanceof PIXI.Graphics) return
        outline.drawRect(child.x, child.y, child.width, child.height)
      })
    },

    render(word) {
      const {last, maxWidth} = this

      for (const char of word) {
        if (!char.trim()) continue

        const
          item = new PIXI.Text(char, {
            fill: this.color,
            fontSize: +this.size,
            fontFamily: this.name,
            lineHeight: this.height
          }),
          {width, height} = item

        item.text = char
        item.code = char.codePointAt(0)
        item.position.set(last.x, last.y)

        last.x += width

        if (last.x + width > maxWidth) {
          last.x = 0
          last.y += last.h
        }

        if (last.h < height) {
          last.h = height
        }

        stage.addChild(item)
      }

      this.stroke()
    },

    extract() {
      return renderer.plugins.extract.base64(stage).split(',')[1]
    },

    createXML() {
      const list = [
        '<font>',
        `<info face="${this.name}" size="${this.size}"/>`,
        `<common lineHeight="${this.height}" pages="1"/>`,
        `<pages><page id="0" file="${this.name}.png"/></pages>`,
        `<chars count="${stage.children.length}">`
      ]

      /* chars */
      stage.children.forEach(child => {
        if (!(child instanceof PIXI.Text)) return
        list.push(`<char id="${child.code}" x="${child.x}" y="${child.y}" width="${child.width}" height="${child.height}" xoffset="0" yoffset="0" xadvance="${child.width + this.spacing}"/>`)
      })

      list.push('</chars></font>')

      return list.join('')
    },

    download() {
      const
        zip = new JSZip()

      zip.file(`${this.name}.png`, this.extract(), {base64: true})
      zip.file(`${this.name}.xml`, this.createXML())
      zip.generateAsync({type: 'blob'}).then(data => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(data)
        a.download = `${this.name}.zip`
        a.click()
      })
    }
  },

  async mounted() {
    ({stage, renderer} = await import('./core'))

    outline = new PIXI.Graphics()
    outline.zIndex = 1
    outline.visible = this.outline

    stage.addChild(outline)
  }
}).$mount('.app')