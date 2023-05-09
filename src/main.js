import count from "./js/count.js";
import sum from "./js/sum.js";
// css
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

// iconfont
import "./css/iconfont.css";

// 引入promise的polyfill
// import "core-js/es/promise";

// console.log(count(2, 1));
// console.log(sum(1, 2, 3, 4));

const result1 = count(2, 1);
console.log(result1);
const result2 = sum(1, 2, 3, 4);
console.log(result2);

const promise = Promise.resolve();
promise.then(() => {
    console.log("promise");
});

// 判断是否支持HMR功能
// if (module.hot) {
//     module.hot.accept("./js/sum.js", function (sum) {
//         const result2 = sum(1, 2, 3, 4);
//         console.log(result2);
//     });

//     /* module.hot.accept("./js/count.js", function (count) {
//         const result1 = count(2, 1);
//         console.log(result1);
//     }); */
// }

// 测试动态引入
// document.getElementById("btn").onClick = function () {
//     import(/* webpackChunkName: "math" */ "./js/math.js").then(({ count }) => {
//         console.log(count(2, 1));
//     });
// };

// PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log("SW registered: ", registration);
            })
            .catch((registrationError) => {
                console.log("SW registration failed: ", registrationError);
            });
    });
}
