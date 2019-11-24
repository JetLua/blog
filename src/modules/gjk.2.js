import Interaction from '@iro/interaction'
PIXI.Renderer.registerPlugin('interaction', Interaction)
PIXI.settings.SORTABLE_CHILDREN = true

const
  {sqrt, PI, sin, cos, atan2} = Math,
  PI2 = 2 * PI

let arrow, app

const dots = Array.from({length: 2}, () => {
  const dot = PIXI.Sprite.from('static/images/dot.png')
  dot.anchor.set(.5)
  dot.scale.set(.2)
  return dot
})

const sketch = new PIXI.Graphics()

const btn = new PIXI.Graphics()
  .beginFill(0x2196f3)
  .drawRoundedRect(0, 0, 100, 50, 10)
  .endFill()

btn.zIndex = 1
btn.pivot.set(50, 25)
btn.cursor = 'pointer'
btn.interactive = true
const text = new PIXI.Text('start', {
  fill: 0xffffff,
  fontSize: 16,
  fontWeight: 600
})

text.anchor.set(.5)
text.position.set(btn.width / 2, btn.height / 2)
btn.addChild(text)

export default function(canvas) {
  const {
    innerWidth: width,
    innerHeight: height,
    devicePixelRatio
  } = window

  // const devicePixelRatio = 1

  app = new PIXI.Application({
    view: canvas,
    width: width * devicePixelRatio,
    height: height * devicePixelRatio,
    transparent: true,
    antialias: true
  })

  btn.position.set(app.screen.width - btn.width / 2, app.screen.height - btn.height / 2)

  const poly = new PIXI.Graphics()
  poly.interactive = true
  poly.points = [-60, -60, -120, 0, -60, 60, 60, 60, 120, 0, 60, -60]
  poly.lineStyle(1, 0x03a9f4)
  poly.beginFill(0x03a9f4, .2)
  poly.drawPolygon(poly.points)
  poly.endFill()
  poly.position.set(200, 200)

  const circle = new PIXI.Graphics()
  circle.interactive = true
  circle.r = 60
  circle.lineStyle(1, 0xff5722)
  circle.beginFill(0xff5722, .2)
  circle.drawCircle(0, 0, circle.r)
  circle.endFill()
  circle.position.set(400, 400)

  arrow = PIXI.Sprite.from('static/images/arrow.png')
  arrow.anchor.set(.5)
  arrow.scale.set(.2)
  arrow.position.set(app.screen.width >> 1, app.screen.height >> 1)

  const origin = new PIXI.Graphics()
    .lineStyle(1, 0xff5722)
    .beginFill(0xff5722, .2)
    .drawCircle(0, 0, 4)
    .endFill()

  origin.position.copyFrom(arrow.position)

  let selected = {}
  app.stage.addChild(origin, arrow, poly, circle, sketch, btn)
  app.renderer.plugins.interaction.on('pointerdown', ev => {
    const {target, id} = ev
    if (!target || (target !== circle && target !== poly)) return
    selected[id] = target
    selected[id].down = {x: ev.x, y: ev.y}
  }).on('pointermove', ev => {
    const {target, id} = ev
    if (!selected || !selected[id]) return
    const
      _selected = selected[id],
      {down} = _selected
    _selected.x += ev.x - down.x
    _selected.y += ev.y - down.y
    down.x = ev.x
    down.y = ev.y
    text.text = 'moving'
    sketch.clear()
    generator = null
  }).on('pointerup', ({id}) => {
    delete selected[id]
    text.text === 'moving' ? text.text = 'start' : 0
  })

  let generator

  btn.on('tap', () => {
    if (!generator) {
      generator = collide(circle, poly)
      text.text = 'next'
    } else {
      const {value, done} = generator.next()
      if (!done) text.text = 'next'
      else if (value != null) text.text = !!value
    }
  })
}





function* collide(s1, s2) {
  let direction
  const queue = []
  while (true) {
    switch (queue.length) {
      case 0: {
        direction = new Vec(s1.x - s2.x, s1.y - s2.y)
        if (!direction.x && !direction.y) return true
        break
      }

      case 1: {
        direction.mul(-1)
        break
      }

      case 2: {
        const [p, q] = queue
        direction = triple(
          {x: q.x - p.x, y: q.y - p.y},
          {x: -p.x, y: -p.y},
          {x: q.x - p.x, y: q.y - p.y}
        )
        break
      }

      case 3: {
        const
          [c, b, a] = queue,
          ao = {x: -a.x, y: -a.y},
          ab = {x: b.x - a.x, y: b.y - a.y},
          ac = {x: c.x - a.x, y: c.y - a.y},
          abp = triple(ac, ab, ab),
          acp = triple(ab, ac, ac)

        if (Vec.dot(abp, ao) > 0) {
          queue.splice(0, 1)
          direction = abp
        } else if (Vec.dot(acp, ao) > 0) {
          queue.splice(1, 1)
          direction = acp
        } else return true

        break
      }
    }
    const
      [p, q] = support(s1, s2, direction),
      v = Vec.from(p.x + s1.x - q.x - s2.x, p.y + s1.y - q.y - s2.y)

    if (Vec.dot(direction, v) <= 0) return false
    queue.push(v)

    arrow.rotation = atan2(direction.y, direction.x)

    let dot = dots[0]
    s1.addChild(dot)
    dot.position.copyFrom(p)
    dot.tint = 0xff5722

    dot = dots[1]
    s2.addChild(dot)
    dot.position.copyFrom(q)
    dot.tint = 0x03a9f4

    sketch.clear()
    sketch.beginFill(0x8bc34a, .2)
    sketch.lineStyle(1, 0x8bc34a)
    const
      hw = app.screen.width / 2,
      hh = app.screen.height / 2
    queue.forEach((p, i) => {
      i ? sketch.lineTo(p.x + hw, p.y + hh) : sketch.moveTo(p.x + hw, p.y + hh)
      sketch.drawCircle(
        p.x + hw,
        p.y + hh,
        4
      )
    })
    sketch.closePath()
    sketch.endFill()

    yield
  }
}

function support(s1, s2, direction) {
  const
    p = farthest(s1, direction),
    q = farthest(s2, direction.clone().mul(-1))

  return [p, q]
}

function farthest({r, points}, direction) {
  if (r) return direction.clone().normalize().mul(r)
  let max = -Infinity, p
  for (let i = 0; i < points.length; i += 2) {
    const
      v = Vec.from(points[i], points[i + 1]),
      d = Vec.dot(direction, v)
    if (d > max) {
      max = d
      p = v
    }
  }
  return p
}

function triple(a, b, c) {
  const
    e = new Vec3(a.x, a.y, 0),
    f = new Vec3(b.x, b.y, 0),
    g = new Vec3(c.x, c.y, 0),
    h = Vec3.cross(e, f),
    i = Vec3.cross(h, g)

  return new Vec(i.x, i.y)
}

class Vec {
  constructor(x = 0, y = 0) {
    this.set(x, y)
  }

  set(x, y) {
    y = y ?? x
    this.x = x
    this.y = y
    return this
  }

  mul(v) {
    this.x *= v
    this.y *= v
    return this
  }

  clone() {
    return new Vec(this.x, this.y)
  }

  normalize() {
    const s = sqrt(this.x ** 2 + this.y ** 2)
    this.x /= s
    this.y /= s
    return this
  }

  static from(x, y) {
    return new Vec(x, y)
  }

  static dot(a, b) {
    return a.x * b.x + a.y * b.y
  }
}

class Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.set(x, y, z)
  }

  set(x, y, z) {
    y = y ?? x
    z = z ?? x
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  static from(x, y, z) {
    return new Vec3(x, y, z)
  }

  static cross(a, b) {
    return new Vec3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    )
  }
}