/**
 * [Set indicator on the page]
 * @param  {[int]} dl [downloads value]
 */
function getDownloads(dl) {
    /* Wait until indicator parent element exists */
    var indicator ="";
    var ce = setInterval(function() {
        if ($('.interest.big')[0] != undefined) {
            if ($('#downloads_indicator').length < 1) {
                /* indicator container */
                var box = document.createElement('div');
                box.style = 'float:right;';
                box.id = 'downloads_indicator';
                /* indicator icon */
                var icon = document.createElement('img');
                icon.src = chrome.extension.getURL('icons/arrow.png');
                icon.style = 'float:left;width:20px;height:20px;margin-top:3px;';
                /* indicator value */
                indicator = document.createElement('li');
                indicator.style = 'margin-top: 4px;margin-left:2px;';
                /* Add to page */
                document.getElementsByClassName('interest big')[0].appendChild(box);
                box.appendChild(icon);
                box.appendChild(indicator);
                indicator.innerText = dl;
            } else {
                indicator.innerText = dl;
                clearInterval(ce);
            }
        } 
    }, 100);
}

/**
 * [Check if current audiotool page is a track page]
 */
function isTrackPage() {
    /* Format url to API address */
    var url = window.location.href.split('https://www.audiotool.com/track/')[1].split('/')[0];
    url = 'https://api.audiotool.com/track/' + url + '/';
    $.get(url, function(data) {
        var dl = $($.parseXML(data)).find('downloads').text();
        getDownloads(dl);
        // console.log('XML loaded from API');
    });
}

function isUserPage(){
    /* Get exact registration date */
        var reg, userName = window.location.href.split("/user/")[1];
        $.get("https://api.audiotool.com/user/"+ userName +"/", function(data) {
            reg = new Date(parseInt($($.parseXML(data)).find("registered").text()));
            var regYear = reg.getFullYear();
            var regMonth = ("0" + (reg.getMonth() + 1)).slice(-2);
            var regDate = ("0" + (reg.getDate() + 1)).slice(-2);
            reg = regYear + "-" + regMonth + "-" + regDate;
            
            document.getElementsByClassName('_registered')[0].innerHTML=reg;
        });
}

$(window).ready(function() {
    isTrackPage();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting == 'trackPage') {
        setTimeout(function() {
            isTrackPage();
        }, 500);
    } else if (request.greeting == 'userPage') {
        setTimeout(function() {
            isUserPage();
        }, 500);
    }
    sendResponse('Message received');
});