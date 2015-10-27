var checkIfReadyID;
var active = false;
var currentHash = "";

var manifest = chrome.runtime.getManifest();
var args = ["%c Monstercat Connect Helper%c v" + manifest.version + "%c by%c " + manifest.author + " %c " + manifest.homepage_url, "background: #222;color: #bada55", "background: #222;color: #c0ffee", "background: #222;color: #bada55", "background: #222;color: #c0ffee", ""];
console.log.apply(console, args);

$(window).on('hashchange', hashchanged);
hashchanged();

function hashchanged() {
  if(window.location.hash != currentHash && checkHash()) {
    onReleasesPage();
    currentHash = window.location.hash;
    // $(window).off('hashchange');
  }
}

function checkHash() {
  if(window.location.hash.indexOf("#music/releases") > -1) {
    return true;
  }
  return false;
}

function onReleasesPage() {
  checkIfReadyID = setInterval(checkIfReady, 500);
  // console.log("on releases page");
}

function checkIfReady() {
  if($("body > div.connect > div.container-view > div.content > div > div > div.content > div > div.releases.grid-view > table > tbody > tr").length > 0) {
    clearInterval(checkIfReadyID);
  }
  $("body > div.connect > div.container-view > div.content > div > div > div.content > div > div.releases.grid-view > table > tbody > tr").each(foreachCall);
}

function foreachCall(i, el) {
  $(el).find("button[role='download-release'] > i").click(downloadMenuOpened);
  // console.log(i);
  // console.log(el);
  // console.log($(el).find("button[role='download-release'] > i"));
  // console.log($("button[role='download-release'] > i"));
  // console.log("foreachcall function")
}

function downloadMenuOpened() {
  // console.log("download menu opened");
  window.setTimeout(isContextMenuOpen, 3);
}

function isContextMenuOpen() {
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
