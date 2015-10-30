var checkIfReadyID;
var active = false;
var currentHash = "";

var manifest = chrome.runtime.getManifest();
var args = ["%c Monstercat Connect Helper%c v" + manifest.version + "%c by%c " + manifest.author + " %c " + manifest.homepage_url, "background: #222;color: #bada55", "background: #222;color: #c0ffee", "background: #222;color: #bada55", "background: #222;color: #c0ffee", ""];
console.log.apply(console, args);

$(window).on('hashchange', hashchanged);
hashchanged();
addDownloadAllButton();

function hashchanged() {
    if (window.location.hash != currentHash && checkHash()) {
        onReleasesPage();
        currentHash = window.location.hash;
        // $(window).off('hashchange');
    }
}

function checkHash() {
    return window.location.hash.indexOf("#music/releases") > -1;
}

function onReleasesPage() {
    checkIfReadyID = setInterval(checkRegisterDownloadListener, 500);
    // console.log("on releases page");
}

function checkRegisterDownloadListener() {
    var tr = $("body > div.connect > div.container-view > div.content > div > div > div.content > div > div.releases.grid-view > table > tbody > tr");
    if (tr.length > 0) {
        clearInterval(checkIfReadyID);
    }
    //console.log(tr);
    tr.each(registerDownloadMenuListener);
}

function registerDownloadMenuListener(i, el) {
    $(el).find("button[role='download-release'] > i").click(downloadMenuOpened);
    // console.log(i);
    // console.log(el);
    // console.log($(el).find("button[role='download-release'] > i"));
    // console.log($("button[role='download-release'] > i"));
    // console.log("foreachcall function")
}

function downloadMenuOpened() {
    // console.log("download menu opened");
    window.setTimeout(contextMenuOpen, 3);
}

function contextMenuOpen() {
    // console.log($("body > div.context-menu-view.open").length > 0);
    // $("body > div.context-menu-view.open > ul").append();
    var flacELement = $("body > div.context-menu-view.open > ul > li").first().clone(true);
    var newDownloadHref = flacELement.children('a').attr("href").replace("wav", "flac");
    flacELement.attr("index", 5);
    // console.log(flacELement.children('a'));
    flacELement.children('a').text("FLAC");
    flacELement.children('a').attr("href", newDownloadHref);

    // console.log(flacELement);

    flacELement.appendTo($("body > div.context-menu-view.open > ul"));
}

function addDownloadAllButton() {
    var button = "<input type='button' value='Download all>'";
    console.log($(".menu-view > .content"));
    $(".menu-view > .content").append(button).click(checkDownloadAll);
}

function checkDownloadAll() {
    var tr = $("body > div.connect > div.container-view > div.content > div > div > div.content > div > div.releases.grid-view > table > tbody > tr");
    if (tr.length > 0) {
        clearInterval(checkIfReadyID);
    }
    //console.log(tr);
    tr.each(function(value){
        var release_id = value.getAttribute("release-id");
        console.log(release_id)
    });
}

function pressNextButton() {
    $("button[role='page-next']").click()
}