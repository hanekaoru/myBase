
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
                this.className = "active"
            }
        }
    },

    /* 查询字符串的 code 值 【 name 需要查询的字符串 】 */
    getParameterByName: function (name) {

        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),

            results = regex.exec(location.search);

        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

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

    /* 保存 / 读取 key（备用） 【 getQueryObject(url).userId 】 */
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
        
        var obj = document.getElementById("aa");

        obj.innerHTML = secs + "秒后自动跳转……";

        if (--secs > 0) {

            setTimeout("jumpTo(" + secs + ")", 1000);

        } else {

            window.location = url;
        }

    },

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

}
