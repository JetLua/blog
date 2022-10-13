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

| Mode(轮廓的检索模式)      | 说明                                |
| ------------------ | --------------------------------- |
| `cv.RETR_EXTERNAL` | 只检测最外层轮廓                          |
| `cv.RETR_TREE`     | 获取轮廓层级关系                          |
| cv.RETR\_LIST      | 检测所有的轮廓，包括内围、外围轮廓，但是检测到的轮廓不建立等级关系 |
|                    |                                   |



