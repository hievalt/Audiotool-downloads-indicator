/**
 * [Set indicator on the page]
 * @param  {[int]} dl [downloads value]
 */
function getDownloads(dl) {
    /* Wait until indicator parent element exists */
    var ce = setInterval(function() {
        if ($('.interest.big')[0] != undefined && $('#downloads_indicator').length < 1) {
            /* indicator container */
            var box = document.createElement('div');
            box.style = 'float:right;';
            box.id = 'downloads_indicator';
            /* indicator icon */
            var icon = document.createElement('img');
            icon.src = chrome.extension.getURL('icons/arrow.png');
            icon.style = 'float:left;width:20px;height:20px;margin-top:3px;';
            /* indicator value */
            var indicator = document.createElement('li');
            indicator.innerText = dl;
            indicator.style = 'margin-top: 4px;margin-left:2px;';
            /* Add to page */
            document.getElementsByClassName('interest big')[0].appendChild(box);
            box.appendChild(icon);
            box.appendChild(indicator);

            clearInterval(ce);
        }
    }, 100);
}

/**
 * [Check if current audiotool page is a track page]
 */
function isTrackPage() {
    var latestTrackUrl, latestTrackData;
    /* Loop for condition checking */
    var timer = setInterval(function() {

        if (window.location.href.includes('https://www.audiotool.com/user/')) {
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
        /**
         * [Load XML document from API]
         */
        function getData() {

            /* Format url to API address */
            var url = window.location.href.split('https://www.audiotool.com/track/')[1].split('/')[0];
            url = 'https://api.audiotool.com/track/' + url + '/';

            /* Prevent loading same XML multiple times if user stays on the same track page */
            if (url != latestTrackUrl) {
                $.get(url, function(data) {
                    var dl = $($.parseXML(data)).find('downloads').text();
                    latestTrackData = dl; /* Save download value */
                    getDownloads(dl);
                    latestTrackUrl = url;
                    /* console.log('XML loaded from API'); */
                });
                /* If user is still on the same track page, get latest loaded data */
            } else {
                getDownloads(latestTrackData);
                /* console.log('Saved some bandwidth ;-)'); */
            }
        }
        /* Check if page is a track page and if indicator exists */
        if (window.location.href.includes('https://www.audiotool.com/track/') && $('.interest.big')[0] != undefined && $('#downloads_indicator').length < 1) getData();
    }, 1000);
}

isTrackPage();