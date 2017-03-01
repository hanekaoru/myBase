
"use strict";

/**
 *=======================================================================
 *
 *  个人工具方法类库集合，部分方法依赖 jQuery
 *  @created： by VSC
 *  @author： shaobo（https://github.com/hanekaoru/）
 *  @version：  2017-02-28（新建）
 *  
 *  2017-03-01  添加一些操作 dom 相关的方法
 *  
 * 
 *
 *=======================================================================
 */



// ------------------------ 常用方法 ---------------------------------//



    /* tab 切换 （类似于 jQuery 的 siblings() 方法） 【 obj 为父级元素 】 */
    function tab(obj) {
        for (var i = 0; i < obj.length; i++) {
            obj[i].onclick = function () {
                for (var i = 0; i < obj.length; i++) {
                    obj[i].className = "";
                }
                obj.className = "active"
            }
        }
    }


    /* 解析 url 为字典对象 【 getQueryObject(url).userId 】 */
    function getQueryObject(url) {

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

    }


    /* 随机验证码 【 createCode() 】 */
    function createCode() {

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

    }


    /* 导航 下拉隐藏 上拉显示 【 scrollHide($("#header")) 】 */
    function scrollHide(obj) {

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

    }


    /* 多少秒后自动跳转（内部需要获取 id） 【 jumpTo(60, "url地址") 】 */
    function jumpTo(secs, url) {

        var obj = document.getElementById("obj");

        obj.innerHTML = secs + "秒后自动跳转……";

        if (--secs > 0) {

            setTimeout("jumpTo(" + secs + ")", 1000);

        } else {

            window.location = url;
        }

    }


    /* iframe 高度自适应 【 <iframe id="myFrameId" onload="iframeHeight()"></iframe> 】 */
    function iframeHeight() {

        var ifm = document.getElementById("myFrameId");
        var subWeb = document.frames ? document.frames["myFrameId"].document : ifm.contentDocument;

        if (ifm != null && subWeb != null) {
            ifm.height = subWeb.body.scrollHeight;
            ifm.width = subWeb.body.scrollWidth;
        }

    }


    /* 保存 / 读取 key（备用） 【 saveKey() 】 */
    function saveKey() {
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
    }


    /* 拖拽函数 【 $(obj).drag() 】 */
    $.fn.drag = function () {

        //  定义拖拽函数
        //  父元素内部的子元素的拖拽
        //  父元素需要指定高度

        var $this = $(this);
        var parent = $this.parent();

        var pw = parent.width();
        var ph = parent.height();
        var thisWidth = $this.width() + parseInt($this.css('padding-left'), 10) + parseInt($this.css('padding-right'), 10);
        var thisHeight = $this.height() + parseInt($this.css('padding-top'), 10) + parseInt($this.css('padding-bottom'), 10);

        var x, y, positionX, positionY;
        var isDown = false;

        var randY = parseInt(Math.random() * (ph - thisHeight), 10);
        var randX = parseInt(Math.random() * (pw - thisWidth), 10);


        parent.css({
            "position": "relative",
            "overflow": "hidden"
        });

        $this.css({
            "cursor": "move",
            "position": "absolute"
        }).css({
            top: randY,
            left: randX
        }).mousedown(function (e) {
            //如果有多个拖拽元素，当其中一个mousedown的时候，当前div的zIndex为1，其余的为0
            parent.children().css({
                "zIndex": "0"
            });
            $this.css({
                "zIndex": "1"
            });
            //然后设置允许拖拽，设置其的position
            isDown = true;
            x = e.pageX;
            y = e.pageY;
            positionX = $this.position().left;
            positionY = $this.position().top;
            return false;
        });


        $(document).mouseup(function (e) {
            isDown = false;
        }).mousemove(function (e) {
            var xPage = e.pageX;
            var moveX = positionX + xPage - x;

            var yPage = e.pageY;
            var moveY = positionY + yPage - y;
            //判断边界
            if (isDown == true) {
                $this.css({
                    "left": moveX,
                    "top": moveY
                });
            } else {
                return;
            }
            if (moveX < 0) {
                $this.css({
                    "left": "0"
                });
            }
            if (moveX > (pw - thisWidth)) {
                $this.css({
                    "left": pw - thisWidth
                });
            }
            if (moveY < 0) {
                $this.css({
                    "top": "0"
                });
            }
            if (moveY > (ph - thisHeight)) {
                $this.css({
                    "top": ph - thisHeight
                });
            }
        });
    };


    /* 运动函数（改变元素位置/透明度等） 【 move(this, "opacity", 30) / move(this, width, 300px) 】 */
    function move(obj, attr, iTarget) {

        // 注意，依赖下方的 css 方法（获取css）

        clearInterval(obj.timer);

        obj.timer = setInterval(function () {

            var cur = 0;

            if (attr == "opacity") {
                cur = parseFloat(css(obj, attr)) * 100;
            } else {
                cur = parseInt(css(obj, attr));
            }

            var speed = (iTarget - cur) / 6;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

            if (cur == iTarget) {
                clearInterval(obj.timer);
            } else {
                if (attr == "opacity") {
                    obj.style.filter = "alpha(opacity:" + (cur + speed) + ")";
                    obj.style.opacity = (cur + speed) / 100;
                } else {
                    obj.style[attr] = cur + speed + "px";
                }
            }

        }, 30);
        
    };


    /* 连续运动函数（不停改变元素 / 类似 CSS3 动画实现效果） 【 act(div, "width", 0, callback) 】*/
    /**
     * --------------------------------
     * 
     *  连续运动（类似 Animate 的回调）
     *  act(div, "width", 0, function () {
     *      act(div, "width", x + 100, function () {
     *          span.style.display = "block";
     *          span.style.right = x + 100 + "px";
     *      });
     *  });
     *
     *  act(div, "left", (this.offsetLeft + 100));
     * 
     * --------------------------------
     * 
     */
    function act(obj, attr, target, fn) {

        clearInterval(obj.timer);

        obj.timer = setInterval(function () {

            var stop = true;
            var cur = parseInt(css(obj, attr));
            var speed = (target - cur) / 8;

            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

            if (cur != target) {
                stop = false;
                obj.style[attr] = speed + cur + "px";
            }

            if (stop) {
                clearInterval(obj.timer);
                obj.timer = null;
                fn && fn();
            }

        }, 30);
        
    }


    /* 透明度改变函数（一般用于幻灯片渐隐渐现切换） 【 fade(oLi[index], 100) / fade(oLi[i], 0) 】 */
    function fade(obj, target, fn) {

        clearInterval(obj.timer);

        obj.timer = setInterval(function () {

            var stop = true;
            var cur = css(obj, 'opacity') * 100;
            var speed = (target - cur) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

            if (cur != target) {
                stop = false;
                cur += speed;
                obj.style.filter = 'alpha(opaicty=' + cur + ')';
                obj.style.opacity = cur / 100;
            }

            if (stop) {
                clearInterval(obj.timer);
                obj.timer = null;
                fn && fn();
            }

        }, 30);
        
    }


// ------------------------ 获取数据相关 ---------------------------------//




    /* 获取当前元素所有最终使用的 CSS 属性值 【 css(obj, attr) 】 */
    function css(obj, attr) {

        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj, null)[attr];
        }
        
    }


    /* 获取元素的 Class 【 getClass(div, "div_list") 】 */
    /**
     * --------------------------------
     * 
     *  var div = getClass(div, "div_list")
     * 
     *  document.all 是页面内所有元素的一个集合
     * 
     *  例如：document.all(0) 表示页面内第一个元素
     * 
     * --------------------------------
     * 
     */
    function getClass(parent, cls) {

        var res = [];

        if (parent.getElementsByClassName) {
            res = parent.getElementsByClassName(cls);
        } else {
            var reg = new RegExp("\\s+|^" + cls + "\\s+|$"),
                all = parent.all;

            for (var i = 0; i < all.length; i++) {
                if (reg.test(all[i].className)) {
                    res.push(all[i]);
                }
            }

        }

        return res;

    }


    /* 获取一个随机的颜色 【 randColor() 】 */
    function randColor() {

        return "rgb(" + Math.ceil(255 * Math.random()) + "," + Math.ceil(255 * Math.random()) + "," + Math.ceil(255 * Math.random()) + ")";

    }


    /* 获取当前时间 【 getTime() 】*/
    function getTime() {

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
    }


    /* 查询 & 获取 字符串的 code 值 【 name 需要查询的字符串 】 */
    function getParameterByName(name) {

        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),

            results = regex.exec(location.search);

        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

    }




// ------------------------ 判断相关 ---------------------------------//




    /* 判断上传文件大小及类型 【 CheckFile("file元素") 】 */
    function CheckFile(obj) {

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

    }




// ------------------------ 移动端相关 ---------------------------------//




    /* 滑动底部加载更多 【 ... 】 */

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



    /* 遮罩层下禁止滑动 【 禁止滑动 】 */

    $("body").bind("touchmove", function (event) { event.preventDefault() });



    /* 遮罩层下开启滑动 【 开启滑动 】 */

    $("body").unbind("touchmove");



    /* 设置页面 rem 比例 【 rem 】 */
    (function () {
        var clientWidth = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;

        if (clientWidth > 640) clientWidth = 640;

        document.documentElement.style.fontSize = clientWidth * 1 / 16 + "px";

        return clientWidth * 1 / 16;
    })();




// ------------------------ 日历相关 ---------------------------------//




    /* 序列化时间戳 【 timestamp(1487904182000) 】*/
    function timestampList(time) {

        var date = new Date(time);

        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

        return (Y + M + '-' + D + ' ' + h + ':' + m);

    }


    /* 日历中参数补零 【 zeroFill(date) => 9 => 09年/月 】*/
    function zeroFill(x) {
        return x = x < 10 ? "0" + x : x;
    }


    /* 时间间隔天数计算 【 DateDiff(s1, s2) 】*/
    function dateDiff(sDate1, sDate2) {

        // s1 = "2017-09-30"
        // s2 = "2017-10-08"

        var aDate, oDate1, oDate2, iDays;

        aDate = sDate1.split("-")
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-12-2012格式

        aDate = sDate2.split("-")
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])

        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    // 把相差的毫秒数转换为天数

        return iDays

    }



// ------------------------ 算法相关 ---------------------------------//




    /* 记忆函数 【 memoizer 】*/
    var memoizer = function (memo, fundamental) {
        var shell = function (n) {
            var result = memo[n];
            if (typeof result !== "number") {
                result = fundamental(shell, n);
                memo[n] = result;
            }
            return result;
        }
        return shell;
    }


    /* 利用记忆函数计算阶乘 【 myBase.factorial()(5) == 120 】*/
    var factorial = memoizer([1, 1], function (shell, n) {
        return n * shell(n - 1);
    })


    /* 利用记忆函数计算斐波那契数列 【 myBase.factorial()(10) == 55 】*/
    var fibonacci = memoizer([0, 1], function (shell, n) {
        return shell(n - 1) + shell(n - 2);
    })





// ------------------------ 正则相关 ---------------------------------//
