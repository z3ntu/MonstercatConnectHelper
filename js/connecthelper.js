var checkIfReadyID;
var active = false;
var currentHash = "";
var release_ids = [];

var manifest = chrome.runtime.getManifest();
var args = ["%c Monstercat Connect Helper%c v" + manifest.version + "%c by%c " + manifest.author + " %c " + manifest.homepage_url, "background: #222;color: #bada55", "background: #222;color: #c0ffee", "background: #222;color: #bada55", "background: #222;color: #c0ffee", ""];
console.log.apply(console, args);

$(window).on('hashchange', hashchanged);
hashchanged();

function hashchanged() {
    if (window.location.hash != currentHash && checkHash()) {
        onReleasesPage();
        currentHash = window.location.hash;
    }
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

        // TEMP MOVE HERE
        addDownloadAllButton();

        tr.each(registerDownloadMenuListener);
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
    var button = $('<div align="center"><input type="button" value="Download All"></div>');
    $(".menu-view > .content").append(button.click(checkDownloadAll));
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
    }
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