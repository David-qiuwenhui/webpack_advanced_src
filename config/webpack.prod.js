const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const os = require("os");
const TerserPlugin = require("terser-webpack-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

// cpu核心数
const threads = os.cpus().length;

const getStyleLoaders = (preProcessor) => {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env"],
                },
            },
        },
        preProcessor,
    ].filter(Boolean);
};

module.exports = {
    // 入口文件
    entry: "./src/main.js",
    // 输出
    output: {
        // path: 文件输出目录（绝对路径）
        path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
        // filename: 输出文件名
        filename: "static/js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
        assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
        clean: true, // 自动将path目录的资源清空
    },
    // loader
    module: {
        rules: [
            {
                test: /\.css$/,
                // 执行顺序：从右到左 从下到上
                use: getStyleLoaders(),
            },
            {
                test: /\.less$/,
                use: getStyleLoaders("less-loader"),
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders("sass-loader"),
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders("stylus-loader"),
            },
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 1 * 1024,
                    },
                },
                /* generator: {
                    filename: "static/imgs/[hash:8][ext][query]",
                }, */
            },
            {
                test: /\.(ttf|woff2?|map4|map3|avi)$/,
                type: "asset/resource",
                /* generator: {
                    filename: "static/media/[hash:8][ext][query]",
                }, */
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "../src"),
                // exclude: /node_modules/, // 排除 node_modules代码不编译
                use: [
                    {
                        loader: "thread-loader", // 开启多进程
                        options: {
                            worker: threads, // 数量
                        },
                    },
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true, // 开启babel编译缓存
                            cacheCompression: false, // 缓存文件不要压缩
                            plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ), // ESLint的缓存路径
            threads, // 开启多线程
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        // 提取 CSS 成单独文件
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
        // CSS 体积压缩
        // new CssMinimizerPlugin(),
        new PreloadWebpackPlugin({
            rel: "preload", // preload相比prefetch兼容性更好
            as: "script",
        }),
        new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            // css压缩也可以写到optimization.minimizer里面
            new CssMinimizerPlugin(),
            // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
            new TerserPlugin({
                parallel: threads, // 开启多进程
            }),
            // 图片的无损压缩
            /* new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }), */
        ],
        // 代码分割配置
        splitChunks: {
            chunks: "all", // 对所有模块都进行分割
        },
        // 提取runtime文件
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
    },
    // 生产模式
    mode: "production",
    devtool: "source-map",
};
