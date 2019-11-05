<template>
  <canvas ref="canvas">

  </canvas>
</template>

<script>
  import Interaction from '@iro/interaction'
  PIXI.Renderer.registerPlugin('interaction', Interaction)

  /**
   * @param {PIXI.Graphics} s1
   * @param {PIXI.Graphics} s2
   */
  function collide(s1, s2) {
    if (s2.points.r) {
      for (let i = 0; i < s1.points.length; i += 2) {
        const
          p1 = {x: s1.points[i] + s1.x, y: s1.points[i + 1] + s1.y},
          p2 = s1.points[i + 2] == null ? {x: s1.points[0] + s1.x, y: s1.points[1] + s1.y} :
            {x: s1.points[i + 2] + s1.x, y: s1.points[i + 3] + s1.y},

          r1 = distance(p1, s2.position) <= s2.points.r ? 1 : -1,
          r2 = distance(p2, s2.position) <= s2.points.r ? 1 : -1,
          r3 = r1 + r2

        if (r3 >= 0) return true

        const
          dx = p1.x - p2.x,
          dy = p1.y - p2.y


        let a, b, c
        if (!dy) {
          a = 1
          b = 0
          c = -s2.x
        } else if (!dx) {
          a = 0
          b = 1
          c = -s2.y
        } else {
          a = dx
          b = dy
          c = -(a * s2.x + b * s2.y)
        }

        let u, v, w
        if (!dy) {
          u = 0
          v = 1
          w = -p1.y
        } else if (!dx) {
          u = 1
          v = 0
          w = -p1.x
        } else {
          u = -dy
          v = dx
          w = -(u * p1.x + v * p1.y)
        }

        let
          d = a * v - u * b,
          x = (b * w - v * c) / d,
          y = (u * c - a * w) / d

        if (distance({x, y}, s2.position) <= s2.points.r &&
          between(x, p1.x, p2.x) &&
          between(y, p1.y, p2.y)) return true
      }
    }

    return contains({x: 0, y: 0}, wrap(md(s1, s2)))
  }

  function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
  }

  function contains(p, points) {
    let wn = 0

    for (let i = 0; i < points.length; i++) {
      const
        p1 = points[i],
        p2 = points[i + 1] || points[0],
        ok = inline(p, p1, p2)

      if (!ok && between(p.x, p1.x, p2.x) && between(p.y, p1.y, p2.y)) return true

      if (p.y >= p1.y) {
        if (p.y < p2.y && ok > 0) wn++
      } else if (p.y >= p2.y && ok < 0) wn--
    }

    return wn & 1
  }

  function between(v, v1, v2) {
    return v >= Math.min(v1, v2) && v <= Math.max(v1, v2)
  }

  function inline(p, p1, p2) {
    return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y)
  }

  function wrap(points) {
    const hull = []

    let current = {x: Infinity}
    for (const p of points) {
      if (p.x < current.x) current = p
    }

    let i = 0, end

    while (true) {
      hull[i] = current
      end = points[0]

      for (let j = 1; j < points.length; j++) {
        if ((end.x === current.x && end.y === current.y) ||
          inline(points[j], hull[i], end) > 0) {
          end = points[j]
        }
      }
      i += 1
      current = end

      if (end.x === hull[0].x && end.y === hull[0].y) break
    }
    return hull
  }

  function md(s1, s2) {
    const s3 = []
    for (let i = 0; i < s1.points.length; i += 2) {
      if (s2.points.r) {
        s3.push({
          x: s1.x + s1.points[i] - s2.x,
          y: s1.y + s1.points[i + 1] - s2.y
        })
      } else {
        for (let j = 0; j < s2.points.length; j += 2) {
          s3.push({
            x: s1.x + s1.points[i] - s2.x - s2.points[j],
            y: s1.y + s1.points[i + 1] - s2.y - s2.points[j + 1]
          })
        }
      }
    }
    return s3
  }

  export default {
    mounted() {
      const {
        innerWidth: width,
        innerHeight: height,
      } = window

      const devicePixelRatio = 1

      const app = new PIXI.Application({
        view: this.$refs.canvas,
        width: width * devicePixelRatio,
        height: height * devicePixelRatio,
        transparent: true,
        antialias: true
      })

      const polygon = new PIXI.Graphics()
        .beginFill(0xcff09e)
        .drawPolygon([
          -30, -30, -60, 0,
          -30, 30, 30, 30,
          60, 0, 30, -30
        ])
        .endFill()

      polygon.points = [
        -30, -30, -60, 0,
        -30, 30, 30, 30,
        60, 0, 30, -30
      ]

      const square = new PIXI.Graphics()
        .beginFill(0xa3daff)
        .drawPolygon([-25, -25, 25, -25, 25, 25, -25, 25])
        .endFill()

      square.points = [-25, -25, 25, -25, 25, 25, -25, 25]

      const circle = new PIXI.Graphics()
        .beginFill(0xfe4365)
        .drawCircle(0, 0, 30)
        .endFill()

      circle.points = {r: 30}

      polygon.position.set(app.screen.width >> 1, app.screen.height >> 1)
      square.x = polygon.x - 100
      square.y = polygon.y - 100
      circle.x = polygon.x + 100
      circle.y = polygon.y + 100

      polygon.interactive =
      square.interactive =
      circle.interactive = true

      app.stage.addChild(polygon, square, circle)

      let obj
      app.renderer.plugins.interaction.on('pointerdown', ev => {
        const {target} = ev
        if (!target) return
        obj = target
        target.down = {
          x: ev.x,
          y: ev.y
        }
      }).on('pointermove', ev => {
        const {target} = ev
        if (!obj) return
        obj.x += ev.x - obj.down.x
        obj.y += ev.y - obj.down.y
        obj.down.x = ev.x
        obj.down.y = ev.y

        polygon.alpha =
        square.alpha =
        circle.alpha = 1
        if (collide(polygon, circle)) {
          polygon.alpha =
          circle.alpha = .5
        }

        if (collide(polygon, square)) {
          polygon.alpha =
          square.alpha = .5
        }

        if (collide(square, circle)) {
          square.alpha =
          circle.alpha = .5
        }
      }).on('pointerup', () => obj = null)
    }
  }
</script>

<style lang="less" scoped>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>