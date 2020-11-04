const LoginStatus = {
    LOGIN: {value: "로그인"},
    SIGNIN: {value: "회원가입"}
}

const MainContents = {
    HOME: {value: "홈", link: "home.html"},
    LOGIN: {value: "로그인", link: "login.html"},
    QUESTION: {value: "질문", link: "question.html"}
}
let contents = MainContents.HOME
let loginStatus = LoginStatus.LOGIN

$(document).ready(() => {
    initAll()

    $("#login_login_icon").click(() => {
        changeMainContents(MainContents.LOGIN)
    })

    $("#main_logo").click(() => {
        changeMainContents(MainContents.HOME)
    })


    $("#main_search_icon").click(() => {
        $("#main_header").hide()
        $("#main_search_box_header").show()
    })

    $("#main_search_close_icon").click(() => {
        console.log("close!!")
        $("#main_header").show()
        $("#main_search_box_header").hide()
    })

    function changeMainContents(content) {
        if (contents !== content) {
            contents = content
            $("#main_contents").load(contents.link)
        }
    }

    function initAll() {
        // 로그인 확인
        if (isLogin()) {
            $("#login_login_icon").hide()
            $("#login_logout_icon").show()
            $("#notification").show()
            checkNotification()
        } else {
            $("#login_login_icon").show()
            $("#login_logout_icon").hide()
            $("#notification").hide()
        }
        // 텍스트 박스 초기화
        initTextField()
        // 검색창 숨김
        $('#main_search_box_header').hide()
        // main contents 표시
        $("#main_contents").load("home.html")
    }

    function isLogin() {
        // 로그인 로직
        return false
    }

    function checkNotification() {
        if (hasNotify()) {
            $("#notification_exist_icon").show()
            $("#notification_none_icon").hide()
        } else {
            $("#notification_exist_icon").hide()
            $("#notification_none_icon").show()
        }
    }

    function hasNotify() {
        // 알림 확인
        return true
    }
})

function initTextField() {
    document.querySelectorAll('.mdc-text-field').forEach(value => {
        new mdc.textField.MDCTextField(value)
    })
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-text-field'))
    document.querySelectorAll('.mdc-button').forEach(value => {
        new mdc.ripple.MDCRipple(value)
    })
    document.querySelectorAll('.mdc-icon-button').forEach(value => {
        let br = new mdc.ripple.MDCRipple(value)
        br.unbounded = true;
    })
}