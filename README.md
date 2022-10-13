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
| `cv.RETR_LIST`     | 检测所有的轮廓，包括内围、外围轮廓，但是检测到的轮廓不建立等级关系 |
| `cv.RETR_CCOMP`    | 检测所有的轮廓，但所有轮廓只建立两个等级关系，外围为顶层      |

| Method(轮廓的近似方法)             | 说明                                                            |
| --------------------------- | ------------------------------------------------------------- |
| `cv.CHAIN_APPROX_NONE`      | 保存物体边界上所有连续的轮廓点到`contours`向量内                                 |
| `cv.CHAIN_APPROX_SIMPLE`    | **仅保存轮廓的拐点信息**，把所有轮廓拐点处的点保存入`contours`向量内，拐点与拐点之间直线段上的信息点不予保留 |
| `cv.CHAIN_APPROX_TC89_L1`   |                                                               |
| `cv.CHAIN_APPROX_TC89_KCOS` |                                                               |

