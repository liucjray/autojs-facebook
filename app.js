
var iWaitSecs = 500;

main();

function existsByDesc(sDesc) {
    return desc(sDesc).exists();
}


// 送出 enter (需 root)
function sendEnter() { shell("input keyevent 66", true); }

// ----------
// 元素選擇器工具區
// ----------
function getUIByDesc(sDesc) {
    return desc(sDesc).findOne(iWaitSecs);
}
function getUIByDescContains(sDesc) {
    return descContains(sDesc).findOne(iWaitSecs);
}
function getUIByText(sText) {
    return text(sText).findOne(iWaitSecs);
}

// ----------
// 滑動工具區
// ----------
function swipeUp() {
    let startX = 500;
    let startY = 600;
    let endX = 500;
    let endY = 2100;
    let duration = 500;
    swipe(startX, startY, endX, endY, duration);
}

function swipeDown() {
    let startX = 500;
    let startY = 1500;
    let endX = 500;
    let endY = 600;
    let duration = 500;
    swipe(startX, startY, endX, endY, duration);
}
function goTopBySwipe() {
    while (existsByDesc('前往個人檔案') === false) {
        log('--- start swipe up ---');
        swipeUp();
    }
    swipeUp();
}
function goDownBySwipe() {
    while (true) {
        log('--- start swipe down ---');
        swipeDown();
        sleep(100);
    }
}


// ----------
// 跳轉頁面
// ----------
function findFanPageByName(fpName) {
    let ui = desc(fpName).text(fpName);
    if (ui.exists()) {
        return ui.findOne(iWaitSecs);
    }
    return false;
}

// 回到首頁
function goHome() {
    // 先點兩次首頁按鈕回到最上層，確保有貼文輸入框可按
    let oUI0 = getUIByDescContains('動態消息，');
    oUI0.clickCenter();
    sleep(500);
    swipeUp();
    sleep(500)
}

// 上一頁
function goBack() {
    let oUI = getUIByDesc('返回');
    if (oUI) {
        oUI.clickCenter();
        return true;
    }
    return false;
}


function goSearchBar() {
    let oSearchBtn = className('android.widget.Button').descContains('搜尋').findOne(iWaitSecs);
    oSearchBtn.clickCenter();
}

function goFanPage(sFanPageName) {
    let oSearchInput = getUIByText('搜尋');
    oSearchInput.setText(sFanPageName);
    sendEnter();
    while (false === findFanPageByName(sFanPageName)) {
        log('wait page: ' + sFanPageName);
        sleep(100);
    }
    findFanPageByName(sFanPageName).clickCenter();
}

// 貼文
function postArticle(article) {

    goHome();

    let step = 1;
    let result = true;
    while (result) {
        log(step);
        switch (step) {
            case 1:
                let oUI1 = getUIByDesc('在 Facebook 撰寫貼文');
                if (oUI1) {
                    oUI1.clickCenter();
                    result = result && true;
                    step++;
                }
                break;
            case 2:
                let oUI2 = getUIByText('建立貼文');
                if (oUI2) {
                    result = result && true;
                    step++;
                }
                break;
            case 3:
                let oUI3 = getUIByText('在想些什麼？');
                if (oUI3) {
                    oUI3.click();
                    result = result && true;
                    step++;
                } else {
                    log('step=' + step + ' occer error');
                    result = false;
                    step = -1;
                }
                break;
            case 4:
                if (oUI3.setText(article)) {
                    sleep(1000);
                    result = result && true;
                    step++;
                }
                break;
            case 5:
                let oUI5 = getUIByDesc('發佈');
                if (oUI5) {
                    oUI5.click();
                    result = result && true;
                    step++;
                }
                break;
            default:
                result = false;
        }
    }
    return result;
}

// 取得隨機文字
function callRandomArticle() {
    let resp = http.get('https://v1.hitokoto.cn');
    return resp.body.json();
}

// 執行區塊
function main() {

    // 如果頁面停留的位置有上一頁可以按
    while (goBack()) {
        sleep(500);
    }

    let run = 2;
    switch (run) {
        case 1: // 隨機發文
            let oRandArticle = callRandomArticle();
            postArticle(oRandArticle.hitokoto);
            break;
        case 2: // 搜尋並進入粉絲專頁
            goSearchBar();
            goFanPage('潮小糜');
            break;
    }

}
