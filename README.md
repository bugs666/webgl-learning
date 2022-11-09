# webgl-learning

webgl学习

# 踩坑

- Opengl Es语言变量声明后面必须加分号，否则控制台抛警告且不明显，问题不好排查
- 定义uniform变量之前，需要先加精度说明：

    ```
    // 浮点数的精度为中等
    precision mediump float;
    ```

- 纹理贴图中，选择的图像的大小如果不是2的n次幂，需要为纹理对象进行特殊配置

    ```
    // 任何大小的图像都可以被宽高为1的uv尺寸展示
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
    ```