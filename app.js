
var oWaitSecs = 500;



// let lists = id('list').className('android.view.ViewGroup').find(oWaitSecs);
// log(lists);

function existsByDesc(sDesc) {
    return desc(sDesc).exists();
}

log(existsByDesc('前往個人檔案'));


function swipeUp() {
    let startX = 500;
    let startY = 600;
    let endX = 500
    let endY = 2100;
    let duration = 500;
    swipe(startX, startY, endX, endY, duration);
}

function goTopBySwipe() {
    while (existsByDesc('前往個人檔案') === false) {
        swipeUp();
    }
    swipeUp();
}


goTopBySwipe();