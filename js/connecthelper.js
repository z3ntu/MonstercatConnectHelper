var checkIfReadyID;
var checkMenuViewID;
var currentHash = "";
var release_ids = [];

var manifest = chrome.runtime.getManifest();
var args = ["%c Monstercat Connect Helper%c v" + manifest.version + "%c by%c " + manifest.author + " %c " + manifest.homepage_url, "background: #222;color: #bada55", "background: #222;color: #c0ffee", "background: #222;color: #bada55", "background: #222;color: #c0ffee", ""];
console.log.apply(console, args);

$(window).on('hashchange', hashchanged);
hashchanged();

checkMenuViewID = setInterval(checkMenuViewReady, 500);


function hashchanged() {
    if (window.location.hash != currentHash && checkHash()) {
        onReleasesPage();
        $("#downloadAllButton").show();
    } else {
        $("#downloadAllButton").hide();
    }
    currentHash = window.location.hash;
}

function checkHash() {
    return window.location.hash.indexOf("#music/releases") > -1;
}

function onReleasesPage() {
    checkIfReadyID = setInterval(checkReleasesReady, 500);
}

function checkReleasesReady() {
    var tr = $("body > div.connect > div.container-view > div.content > div > div > div.content > div > div.releases.grid-view > table > tbody > tr");
    if (tr.length > 0) {
        clearInterval(checkIfReadyID);

        tr.each(registerDownloadMenuListener);
    }
}

function checkMenuViewReady() {
    if($(".menu-view > .content").length) {
        clearInterval(checkMenuViewID);
        addDownloadAllButton();
    }
}

function registerDownloadMenuListener(i, el) {
    $(el).find("button[role='download-release'] > i").click(downloadMenuOpened);
}

function downloadMenuOpened() {
    window.setTimeout(contextMenuOpen, 3);
}

function contextMenuOpen() {
    var flacELement = $("body > div.context-menu-view.open > ul > li").first().clone(true);
    var newDownloadHref = flacELement.children('a').attr("href").replace("wav", "flac");
    flacELement.attr("index", 5);
    flacELement.children('a').text("FLAC");
    flacELement.children('a').attr("href", newDownloadHref);

    flacELement.appendTo("body > div.context-menu-view.open > ul");
}

function addDownloadAllButton() {
    var menuviewContent = $(".menu-view > .content");
    var button = $('<div align="center"><input id="downloadAllButton" type="button" value="Download All"></div>');
    menuviewContent.append(button.click(checkDownloadAll));
    var downloadButton = $('<div align="center"><a style="display: none;" id="downloadNow">Download Now</a></div>');
    menuviewContent.append(downloadButton.click(downloadList));
}

function checkDownloadAll() {
    var tr = $("body > div.connect > div.container-view > div.content > div > div > div.content > div > div.releases.grid-view > table > tbody > tr");

    tr.each(function(i, el){
        var release_id = el.getAttribute("release-id");
        release_ids.push(release_id);
    });
    if(pressNextButton()) {
        setTimeout(checkDownloadAll, 100);
    } else {
        console.log(release_ids);
        downloadList();
    }
}

function downloadList() {
    var button = $("#downloadNow");
    button.attr("download", "monstercatconnect.json");
    button.attr('href', "data:application/json,"+JSON.stringify(release_ids));
    button.show();
}

function pressNextButton() {
    return pressButton("page-next");
}

function pressButton(role) {
    var nextButton = $("button[role='"+role+"']");
    if(nextButton.is(":disabled")){
        return false;
    }
    nextButton.click();
    return true;
}