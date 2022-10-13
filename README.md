# findContours

## 基本用法

```typescript
const im = cv.imread('image_path')
cv.cvtColor(im, im, cv.COLOR_RGB2GRAY)
cv.threshold(im, im, 127, 255, cv.THRESH_BINARY_INV)
const contours = new cv.MatVector()
const hierarchy = new cv.Mat()
cv.findContours(im, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_NONE)
```

```markup
cv.RETR_TREE: 获取轮廓层级关系
```
