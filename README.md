# 介绍

油猴脚本/bangumi 组件，用于在时间胶囊页导出 [Bangumi](https://bgm.tv) 用户时间胶囊数据。

# 开发

```
# 克隆此仓库后
pnpm install
pnpm run dev
```

# 构建

```
pnpm run build
```

# 使用

在用户时间胶囊界面添加了一个按钮用于导出个人数据。

![截图](https://github.com/user-attachments/assets/26ad2917-f765-4109-86ea-07efbbf74ef2)

# 代办项

- [ ] 规避特殊请求500错误码问题，详见 [issue](https://github.com/bangumi/server-private/issues/1467)。

- [ ] 处理多个收藏条目图片和其他信息显示

- [ ] 处理其余次要内容导出

- [ ] 重建目录结构