module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-url": {},
    // "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {},
    // 该插件可以让我们使用CSS未来的特性，其会对这些特性做相关的兼容性处理
    "postcss-preset-env": {},
    // postcss-px-to-viewport: postcss-px-to-viewport插件主要用来把px单位转换为vw、vh、vmin或者vmax这样的视窗单位
    "postcss-px-to-viewport": {
      viewportWidth: 1920, // 视窗的宽度，对应的是我们设计稿的宽度
      viewportHeight: 1080, // 视窗的高度，也可以不配置
      unitPrecision: 4, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: "vw", // 指定需要转换成的视窗单位，建议使用vw
      // selectorBlackList: [/^html$/], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名。
      minPixelValue: 2, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值。
      mediaQuery: false // 允许在媒体查询中转换`px`
    },
    // cssnano: cssnano主要用来压缩和清理CSS代码。在Webpack中，cssnano和css-loader捆绑在一起，所以不需要自己加载它。不过你也可以使用postcss-loader显式的使用cssnano
    cssnano: {
      "cssnano-preset-advanced": {
        zindex: false,
        autoprefixer: false
      }
    }
  }
};
