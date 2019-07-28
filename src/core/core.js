PIXI.settings.SORTABLE_CHILDREN = true

const
  view = document.querySelector('canvas'),
  {
    offsetWidth: width,
    offsetHeight: height
  } = view,

  renderer = new PIXI.Renderer({
    view,
    width,
    height,
    antialias: true,
    transparent: true
  }),

  stage = new PIXI.Container(),

  ticker = PIXI.Ticker.shared


ticker.add(() => renderer.render(stage))

export {
  stage,
  ticker,
  renderer
}