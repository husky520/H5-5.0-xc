(function () {
    'use strict';
    
    require('./jweixin-1.4.0.js');
    const setWx = require('./wx.js');
    setWx();

    // load dependencies
    var animationControl = require('./animation-control.js');
    var isTransition = false;


    $(document).ready(function () {
        var video = $('#_video')[0];
        var audio = $('#_audio')[0];
        var bgMusic = $('audio').get(0);
        var $btnMusic = $('.btn-music');
        var $upArrow = $('.up-arrow');
        var $pageTitle = $('.slide-4 .top-title');
        var $pageDesc = $('.slide-4 .top-desc');

        var textContent = [
            {
                title: '户型绘制匹配，轻松吸引客户',
                desc: '手指滑动，精准还原各小区3D房型',
            }, {
                title: '独家海量图库,自由调整参数',
                desc: '自由调整产品颜色、材质、光影、倒角、镜面等特点，拥有独家素材库。',
            }, {
                title: '多种吊顶款式，随意搭配灯具',
                desc: '一键拖动，制作吊顶造型。',
            }, {
                title: '实时渲染,墙面效果图高清展示',
                desc: '支持不同纹理、工艺基底切换，感受墙面真实感材质，增加墙体框设计，编辑印花图案和浦发。',
            }, {
                title: '风格速切，大面积铺装展示',
                desc: '切换心仪地板，查看效果，调整不同风格，更换搭配，展示大面积铺装效果。',
            }, {
                title: '1:1还原门窗，模拟真实动态',
                desc: '1:1真实还原家中门窗，切换不同款式门窗，模拟开关门效果。',
            }, {
                title: '移动端真VR设计，简便又实用',
                desc: '支持人人都能随时随地卖出高单值。无需高配置的电脑设备，只需手机或平板，即可轻松设计，感受真VR搭配效果。',
            }, {
                title: '数字化导购管理',
                desc: '大数据助力高效经营，标准业务流程规范，快速培养专业导购，客户对接记录。案例分类管理，随时调用查询。',
            }
        ]

        // background music control
        $btnMusic.click(function () {
            if (bgMusic.paused) {
                bgMusic.play();
                $(this).removeClass('paused');
            } else {
                bgMusic.pause();
                $(this).addClass('paused');
            }
        });

        // init Swiper
        var mySwiper = new Swiper('.swiper-container', {
            mousewheelControl: true,
            effect: 'coverflow',    // slide, fade, coverflow or flip
            speed: 400,
            direction: 'vertical',
            fade: {
                crossFade: false
            },
            coverflow: {
                rotate: 100,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: false     // do disable shadows for better performance
            },
            flip: {
                limitRotation: true,
                slideShadows: false     // do disable shadows for better performance
            },
            onInit: function (swiper) {
                animationControl.initAnimationItems();  // get items ready for animations
                animationControl.playAnimation(swiper); // play animations of the first slide
            },
            onTransitionStart: function (swiper) {     // on the last slide, hide .btn-swipe
                isTransition = true;
                if (swiper.activeIndex === swiper.slides.length - 1) {
                    $upArrow.hide();
                } else {
                    $upArrow.show();
                }
            },
            onTransitionEnd: function (swiper) {       // play animations of the current slide
                isTransition = false;
                animationControl.playAnimation(swiper);
                var index = swiper.activeIndex;
                if (index === 3) {
                    swiper.lockSwipeToNext();
                    autoPlay();
                } else {
                    swiper.unlockSwipeToNext();
                }
                if (index === 3) {
                    autoPlay();
                }
            },
            onclick: function (swiper, event) {    // mobile devices don't allow audios to play automatically, it has to be triggered by a user event(click / touch).
                if (!$btnMusic.hasClass('paused') && bgMusic.paused) {
                    bgMusic.play();
                }
            }
        });

        // hide loading animation since everything is ready
        setTimeout(function() {
            $('.loading-overlay').slideUp();
            // 自动播放音乐
            if (window.WeixinJSBridge) {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                    audio.play();
                }, false);
            } else {
                document.addEventListener("WeixinJSBridgeReady", function () {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        audio.play();
                    });
                }, false);
            }
        }, 500);

        // 进入场景
        $('.model-entry').on('click', function(e) {
            if (!isTransition) {
                mySwiper.slideNext();
            }
        });

        // 返回按钮
        $('.back-btn').on('click', function() {
            if (!isTransition) {
                mySwiper.slideTo(3, 500, true);
            }
        });

        // 导航按钮事件
        $('.nav-item').on('click', function(e) {
            if (!isTransition) {
                var index = $(this).data('navIndex');
                mySwiper.unlockSwipeToNext();
                mySwiper.slideTo(3, 1000, true);
                navigate(index);
            }
        });

        // 点击播放视频
        $('#_video').on('click', function() {
            autoPlay()
        });

        function navigate(index) {
            mySwiper.unlockSwipeToNext();
            if (index >= 0 && index <= 7) {
                // 切换类名
                var $navs = $('.item-nav-wrapper .nav-item');
                $navs.each(function(i, v) {
                    if (i === index) {
                        $(v).addClass('active');
                    } else {
                        $(v).removeClass('active');
                    }
                });
                video.src = 'https://resources.wecareroom.com/assets/audio/0' + index + 1 + 'mp4';
                autoPlay();

                // 更换文字
                $pageTitle.text(textContent[index].title);
                $pageDesc.text(textContent[index].desc);
            } else if (index === 8) {
                mySwiper.slideTo(4, 500, true);
            } else if (index === 9) {
                mySwiper.slideTo(5, 500, true);
            }
        }

        function autoPlay() {
            if (window.WeixinJSBridge) {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                    video.play();
                }, false);
            } else {
                document.addEventListener("WeixinJSBridgeReady", function () {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        video.play();
                    });
                }, false);
            }
            video.play();
            return false;
        }
    });
})();
