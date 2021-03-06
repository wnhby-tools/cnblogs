﻿/*
功能：	自动为博客园文章生成目录
原理：	抓取页面中的h1,h2,h3，生成<li>
参考：	https://www.cnblogs.com/marvin/p/ExtendWizNoteAutoNnavigation.html
	  https://www.cnblogs.com/asxinyu/p/Bolg_Category_For_BlogBeauty.html
*/
$(document).ready(function () {
    //mobile detect 如果是移动平台，不显示侧边栏
    var md = new MobileDetect(window.navigator.userAgent);
    if (md.mobile()) {
        //$('#mainContent').css('style','1');
        //  console.log("you platform is mobile");
        return;
    } else {
        //console.log("you platform not mobile ");
        buildCatlog();
        buildTocTable();
    }
});

//=============== cnblogs生成右侧目录 start ===============
function buildCatlog() {
    var body = $('body'),
        cnblogs_post_body = 'cnblogs_post_body',
        sideNavBody = 'sideToolbar',
        sideCatalog = 'sideCatalog',
        f = 'sideCatalog-catalog',
        sideCatalogCtrl = 'sideCatalogBtn',
        h = 'sideToolbar-up',
        //默认显示文章目录
        //navcontaint = '<div id="sideToolbar">\<div class="sideCatalogBg"id="sideCatalog">\<div id="sideCatalog-sidebar">\<div class="sideCatalog-sidebar-top"></div>\<div class="sideCatalog-sidebar-bottom"></div>\</div>\<div id="sideCatalog-catalog">\<ul class="nav"style="width:300px;zoom:1">\</ul>\</div>\</div>\</div>\<a href="javascript:void(0);" title="[隐藏/显示]目录" id="sideCatalogBtn" class="sideCatalogBtnDisable"></a>',
        navcontaint = "<div id='sideToolbar'>\
                            <div class='sideCatalogBg' id='sideCatalog'>\
                                <div id='sideCatalog-sidebar'>\
                                    <div class='sideCatalog-sidebar-top'></div>\
                                    <div class='sideCatalog-sidebar-bottom'></div>\
                                </div>\
                                <div id='sideCatalog-catalog'>\
                                    <ul class='nav' style='width:300px;zoom:1'>\</ul>\
                                </div>\
                            </div>\
                        </div>\
                        <a href='javascript:void(0);' title='[隐藏/显示]目录' id='sideCatalogBtn' class='sideCatalogBtnDisable'></a>",
        strAppendHtml = '',//生成的目录html代码
        scrollDown = 500,
        lIndex = 0,
        m = 0,
        n = 0,
        header, p = 18,
        isSpiltStr = true, //文字过长时，截取使用...替换
        r = true,
        cnblogs_post_body_flag = $('#' + cnblogs_post_body);


    //只有文章页面才会生成    
    if (cnblogs_post_body_flag.length === 0) {
        return
    };
    body.append(navcontaint);
    header = cnblogs_post_body_flag.find(':header');
    if (header.length > p) {
        r = false;
        var t = cnblogs_post_body_flag.find('h2');
        var u = cnblogs_post_body_flag.find('h3');
        if (t.length + u.length > p) {
            //q = false //如果h2和h3太多，依然要生成h3
        }
    };

    header.each(function (t) {
        var u = $(this),
            v = u[0];

        var title = u.text();
        var text = u.text();

        u.attr('id', 'autoid-' + lIndex + '-' + m + '-' + n)
        //if (!u.attr('id')) {
        //    u.attr('id', 'autoid-' + l + '-' + m + '-' + n)
        //};

        /*文章目录节点：
		    标题1/标题2: <li>
			    标题3: h2Offset
                    标题4: h3Offset
		*/
        if (v.localName === 'h1' || v.localName === 'h2') {
            lIndex++;
            m = 0;
            //超过30字，后面加....
            if (text.length > 30) text = text.substr(0, 30) + "...";
            //h1,h2,h3 如果需要在前面自动生成序号就添加<li><span>' + l + '.&nbsp</span>)
            //j += '<li><span>' + l + '.&nbsp</span><a href="#' + u.attr('id') + '" title="' + title + '">' + text + '</a><span class="sideCatalog-dot"></span></li>';
            strAppendHtml += '<li><a href="#' + u.attr('id') + '" title="' + title + '">' + text + '</a><span class="sideCatalog-dot"></span></li>';
        } else if (v.localName === 'h3') {
            m++;
            n = 0;
            if (isSpiltStr) {
                if (text.length > 28) text = text.substr(0, 28) + "...";
                strAppendHtml += '<li class="h2Offset"><a href="#' + u.attr('id') + '" title="' + title + '">' + text + '</a></li>';
            }
        } else if (v.localName === 'h4') {
            n++;
            if (r) {
                if (text.length > 26) text = text.substr(0, 26) + "...";
                strAppendHtml += '<li class="h3Offset"><a href="#' + u.attr('id') + '" title="' + title + '">' + text + '</a></li>';
            }
        }
    });
    $('#' + f + '>ul').html(strAppendHtml);
    body.data('spy', 'scroll');
    body.data('target', '.sideCatalogBg');
    $('body').scrollspy({
        target: '.sideCatalogBg'
    });
    $sideCatelog = $('#' + sideCatalog);
    $('#' + sideCatalogCtrl).on('click', function () {
        if ($(this).hasClass('sideCatalogBtnDisable')) {
            $("#" + sideNavBody).css('display', 'block')
            $('#' + sideCatalogCtrl).title = "隐藏目录";
        } else {
            $("#" + sideNavBody).css('display', 'none')
            $('#' + sideCatalogCtrl).title = "显示目录";
        };
        $(this).toggleClass('sideCatalogBtnDisable')
    });
    $('#' + h).on('click', function () {
        $("html,body").animate({
            scrollTop: 0
        }, 500)
    });
    //默认隐藏目录
    $("#" + sideNavBody).css('display', 'none')
    $(this).toggleClass('sideCatalogBtnDisable')
    $(window).scroll(function () {
        var t = $(window).scrollTop();
        //往下滚动x像素就自动显示文章目录
        if (t > scrollDown) {
            $('#' + sideNavBody).css('display', 'block')
        } else {
            $('#' + sideNavBody).css('display', 'none')
        }
    })
}
//=============== cnblogs生成右侧目录 end ===============

//=============== 在文章正文顶部生成TOC start ===============
function buildTocTable() {
    var hArray = $('#cnblogs_post_body').find('h1,h2,h3,h4,h5,h6');
    if (hArray.length < 2) { return; }
    var autoOpenNum = 8      //自动展开的条目
    //.cnblogs_toc ol 控制展开或关闭，默认关闭它
    var htmlCode = "<div style='clear:both'></div>\
    <div class='cnblogs_toc'>\
        <p style='text-align:left;margin:0;'>\
            <span style='float:left; text-indent:0;'>\
                <a id='TocTitle' href='#' onclick='javascript:return OnTitleShowToc(this);' title='系统根据文章中H1到H6标签自动生成文章目录'>文章目录[点击展开](?)</a>\
            </span>\
            <a id='TocTitleSymbol' href='#' onclick='javascript:return OnTitleSymbolShowToc(this);' title='展开'>[+]</a>\
        </p>\
        <ol style='display:none;margin-left:14px;padding-left:14px;line-height:160%;'>";

    var old_h = 0, ol_cnt = 0;
    for (var i = 0; i < hArray.length; i++) {
        var h = parseInt(hArray[i].tagName.substr(1), 10);
        if (!old_h)
            old_h = h;
        if (h > old_h) {
            htmlCode += '<ol>';
            ol_cnt++;
        }
        else if (h < old_h && ol_cnt > 0) {
            htmlCode += '</ol>';
            ol_cnt--;
        }
        if (h == 1) {
            while (ol_cnt > 0) {
                htmlCode += '</ol>';
                ol_cnt--;
            }
        }
        old_h = h;
        var tit = hArray.eq(i).text().replace(/^\d+[.、\s]+/g, '');
        tit = tit.replace(/[^a-zA-Z0-9_\-\s\u4e00-\u9fa5]+/g, '');

        if (tit.length < 100) {
            htmlCode += '<li><a href="#t' + i + '">' + tit + '</a></li>';
            hArray.eq(i).html('<a name="t' + i + '"></a>' + hArray.eq(i).html());
        }
    }
    while (ol_cnt > 0) {
        htmlCode += '</ol>';
        ol_cnt--;
    }
    htmlCode += '</ol></div>';
    htmlCode += '<div style="clear:both"><br /></div>';
    $(htmlCode).insertBefore($('#cnblogs_post_body'));
    //体验优化：如果目录数目过多则自动关闭，否则展开，利于阅读大纲
    if (hArray.length <= autoOpenNum) {
        $("#TocTitle").click();
    }
}

var isOpendToc = false;

function UpdateTocTitle() {
    if (isOpendToc) {
        $("#TocTitleSymbol").attr('title', '收起').html('[-]');
        $("#TocTitle").html('文章目录[点击收起](?)');
    } else {
        $("#TocTitleSymbol").attr('title', '展开').html('[+]');
        $("#TocTitle").html('文章目录[点击展开](?)');
    }
}

function OnTitleShowToc(e) {
    if (!isOpendToc) {
        $(e).parent().parent().next().show();
        isOpendToc = true;
    } else {
        $(e).parent().parent().next().hide();
        isOpendToc = false;
    }
    UpdateTocTitle();
    e.blur();
    return false;
}

function OnTitleSymbolShowToc(e) {
    if (!isOpendToc) {
        $("#TocTitleSymbol").parent().next().show();
        isOpendToc = true;
    } else {
        $("#TocTitleSymbol").parent().next().hide();
        isOpendToc = false;
    }
    UpdateTocTitle();
    e.blur();
    return false;
}
//=============== 在文章正文顶部生成TOC end ===============