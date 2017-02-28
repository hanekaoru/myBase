
"use strict";

/**
 *=======================================================================
 *
 *  个人工具类库集合，部分方法依赖 jQuery
 *  @created： by VSC
 *  @author： shaobo（https://github.com/hanekaoru/）
 *  @version：  2017-02-28
 * 
 *
 *=======================================================================
 */

var myBase = {



    // ------------------------ 常用方法 ---------------------------------//



    /* tab 切换 类似 jQuery 的 siblings() 方法 【 obj 为父级元素 】 */
    tab: function (obj) {
        for (var i = 0; i < obj.length; i++) {
            obj[i].onclick = function () {
                for (var i = 0; i < obj.length; i++) {
                    obj[i].className = "";
                }
                obj.className = "active"
            }
        }
    },


    /* 解析 url 为字典对象 【 getQueryObject(url).userId 】 */
    getQueryObject: function (url) {

        url = url == null ? window.location.href : url;

        var search = url.substring(url.lastIndexOf("?") + 1);
        var obj = {};
        var reg = /([^?&=]+)=([^?&=]*)/g;

        search.replace(reg, function (rs, $1, $2) {

            var name = decodeURIComponent($1);
            var val = decodeURIComponent($2);

            val = String(val);
            obj[name] = val;

            return rs;
            
        });

        return obj;

    },


    /* 保存 / 读取 key（备用） 【 saveKey() 】 */
    saveKey: function () {
        /*
        const STORAGE_KEY = "my-key"

        export default {
            // 读取 getItem
            fetch() {
                return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
            },
            // 保存 setItem
            save(items) {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            }
        }
        */
    },


    /* 随机验证码 【 createCode() 】 */
    createCode: function () {
        
        var code = new Array();
        var codeLength = 4;
        var checkCode = document.getElementById("checkCode");
        checkCode.value = "";
        var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D',
            'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');

        for (var i = 0; i < codeLength; i++) {
            var charIndex = Math.floor(Math.random() * 32);
            code += selectChar[charIndex];
        }

        if (code.length != codeLength) {
            createCode();
        }

        checkCode.value = code;

    },


    /* 导航 下拉隐藏 上拉显示 【 scrollHide($("#header")) 】 */
    scrollHide: function (obj) {
        
        // 导航
        var scroll = 0;

        // 获取导航长宽
        var width = obj.width();
        var height = obj.height();

        $(window).scroll(function () {

            var current = $(window).scrollTop();

            if (current > scroll) {
                // 向下
                slideOutUp(obj);
            } else {
                // 向上
                slideInDown(obj);
            }

            if (current > 0) {
                $("body").css("padding-top", height + "px");
            } else {
                $("body").css("padding-top", 0);
            }

            scroll = current;

        })

        function slideInDown(ele) {

            if (ele.css("display") == "block") {
                return;
            }

            ele.show();

            ele.animate({
                opacity: 1,
                top: 0
            }, 500)
        }

        function slideOutUp(ele) {

            if (ele.css("display") == "none") {
                return;
            }

            ele.animate({
                opacity: 0,
                top: 0 - height + "px"
            }, 500)
        }

    },


    /* 多少秒后自动跳转（内部需要获取 id） 【 jumpTo(60, "url地址") 】 */
    jumpTo: function (secs, url) {
        
        var obj = document.getElementById("obj");

        obj.innerHTML = secs + "秒后自动跳转……";

        if (--secs > 0) {

            setTimeout("jumpTo(" + secs + ")", 1000);

        } else {

            window.location = url;
        }

    },


    /* iframe 高度自适应 【 <iframe id="myFrameId" onload="iframeHeight()"></iframe> 】 */
    iframeHeight: function () {
        
        var ifm = document.getElementById("myFrameId");
        var subWeb = document.frames ? document.frames["myFrameId"].document : ifm.contentDocument;

        if (ifm != null && subWeb != null) {
            ifm.height = subWeb.body.scrollHeight;
            ifm.width = subWeb.body.scrollWidth;
        }

    },


    /* 获取一个随机的颜色 【 randColor() 】 */
    randColor: function () {
        
        return "rgb(" + Math.ceil(255 * Math.random()) + "," + Math.ceil(255 * Math.random()) + "," + Math.ceil(255 * Math.random()) + ")";

    },




    // ------------------------ 判断相关 ---------------------------------//




    /* 判断上传文件大小及类型 【 CheckFile("file元素") 】 */
    jumpTo: function (obj) {

        var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
        var fileSize = 0;
        var array = new Array('gif', 'png', 'jpg', 'mp4', 'ogg');  //可以上传的文件类型  

        if (isIE && !obj.files) {
            var filePath = obj.value;
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;
        } else {
            fileSize = obj.files[0].size;
        }

        var size = fileSize / 1024;

        if (size > 1000) {
            alert("附件不能大于10M");
        }

        if (obj.value == '') {
            alert("请选择要上传的文件!");
            return false;
        } else {

            // 判断文件类型
            var fileContentType = obj.value.match(/^(.*)(\.)(.{1,8})$/)[3];  
            var isExists = false;

            for (var i in array) {
                if (fileContentType.toLowerCase() == array[i].toLowerCase()) {
                    isExists = true;
                    return true;
                }
            }

            if (isExists == false) {
                obj.value = null;
                alert("上传文件类型不正确!");
                return false;
            }

            return false;

        }

    },




    // ------------------------ 移动端相关 ---------------------------------//




    /* 滑动底部加载更多 【 ... 】 */
    loadMore: function () {
        
        $(window).scroll(function () {
            if ($(this).scrollTop() + $(window).height() >= $(document).height() && $(this).scrollTop()) {
                $.ajax({
                    url: url,
                    type: "get",
                    success: function (data) {
                        // ...
                    }
                })
            }
        });

    },


    /* 遮罩层下禁止滑动 【 禁止滑动 】 */
    addBan: function () {
        $("body").bind("touchmove", function (event) { event.preventDefault() });
    },


    /* 遮罩层下开启滑动 【 开启滑动 】 */
    removeBan: function () {
        $("body").unbind("touchmove");
    },


    /* 设置页面 rem 比例 【 rem 】 */
    htmlFontSize: function () {
        var clientWidth = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;

        if (clientWidth > 640) clientWidth = 640;

        document.documentElement.style.fontSize = clientWidth * 1 / 16 + "px";

        return clientWidth * 1 / 16;
    },




    // ------------------------ 字符串相关 ---------------------------------//




    /* 查询字符串的 code 值 【 name 需要查询的字符串 】 */
    getParameterByName: function (name) {

        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),

            results = regex.exec(location.search);

        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

    },




    // ------------------------ 日历相关 ---------------------------------//




    /* 获取当前时间 【 getTime() 】*/
    getTime: function () {

        var date = new Date();

        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mi = date.getMinutes();

        m = (m < 10) ? '0' + m : m;
        d = (d < 10) ? '0' + d : d;
        h = (h < 10) ? '0' + h : h;
        mi = (mi < 10) ? '0' + mi : mi;

        return y + '-' + m + '-' + d + ' ' + h + ':' + mi;
    },


    /* 序列化时间戳 【 timestamp(1487904182000) 】*/
    timestampList: function (time) {

        var date = new Date(time);

        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        
        return (Y + M + '-' + D + ' ' + h + ':' + m);

    },


    /* 日历中参数补零 【 zeroFill(date) => 9 => 09年/月 】*/
    zeroFill: function (x) {
        return x = x < 10 ? "0" + x : x;
    },


    /* 时间间隔天数计算 【 DateDiff(s1, s2) 】*/
    dateDiff: function (sDate1, sDate2) {

        // s1 = "2017-09-30"
        // s2 = "2017-10-08"

        var aDate, oDate1, oDate2, iDays;

        aDate = sDate1.split("-")
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-12-2012格式

        aDate = sDate2.split("-")
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])

        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    // 把相差的毫秒数转换为天数

        return iDays

    },



    // ------------------------ 算法相关 ---------------------------------//




    /* 记忆函数 【 memoizer 】*/
    memoizer: function (memo, fundamental) {

        var shell = function (n) {

            var result = memo[n];

            if (typeof result !== "number") {
                result = fundamental(shell, n);
                memo[n] = result;
            }

            return result;

        }

        return shell;
    },


    /* 利用记忆函数计算阶乘 【 myBase.factorial()(5) == 120 】*/
    factorial: function (memo, fundamental) {

        var result = this.memoizer([1, 1], function (shell, n) {
            return n * shell(n - 1);
        })

        return result;
    },


    /* 利用记忆函数计算斐波那契数列 【 myBase.factorial()(10) == 55 】*/
    fibonacci: function (memo, fundamental) {

        var result = this.memoizer([0, 1], function (shell, n) {
            return shell(n - 1) + shell(n - 2);
        })

        return result;

    },





    // ------------------------ 正则相关 ---------------------------------//




    /* 返回 str 中出现次数最多的字符 【 fineStr(str, 0, []) 】 */
    fineStr: function (s, n, fs) {

        var f = s.match(/^./)[0];
        var rf = new RegExp(f, "g");
        var nn = s.match(rf).length;

        if (nn == n) fs.push(f);

        if (nn > n) { fs = []; fs.push(f); n = nn }

        s = s.replace(rf, "");

        if (s.length < n) { return ["出现次数最多的字符是：" + fs.join(","), "总次数为：" + n]; }

        return fineStr(s, n, fs);

    },


    /* 去除字符串两边空格 【 trim(str) 】 */
    trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

}
