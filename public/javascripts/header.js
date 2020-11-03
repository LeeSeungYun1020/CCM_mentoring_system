// const LoginStatus = {
//     LOGIN: {value: "로그인"},
//     SIGNIN: {value: "회원가입"}
// }
//
// const MainContents = {
//     HOME: {value: "홈", link: "index.html"},
//     LOGIN: {value: "로그인", link: "login.html"},
//     QUESTION: {value: "질문", link: "question.html"}
// }
// let contents = MainContents.HOME
// let loginStatus = LoginStatus.LOGIN

$(document).ready(() => {
    initHeader()

    // 헤더 바로가기
    $("#login_login_icon").click(() => {
        location.href = '/users'
    })
    $("#main_logo").click(() => {
        location.href = '/'
    })

    // 검색창 관련 기능
    $("#main_search_icon").click(() => {
        $("#main_header").hide()
        $("#main_search_box_header").show()
    })
    $("#main_search_close_icon").click(() => {
        $("#main_header").show()
        $("#main_search_box_header").hide()
    })
    $("#main_search_box_input").blur(() => {
        $("#main_search_close_icon").click()
    })
    $("#main_search_box_input").keypress(function (event) {
        if (event.key === "Enter") {
            console.log("Search: " + this.value)
            $(this).val("")
            $("#main_search_box_header").hide()
        }
    })

    function initHeader() {
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
    }

    function initTextField() {
        document.querySelectorAll('.mdc-text-field').forEach(value => {
            new mdc.textField.MDCTextField(value)
        })
        document.querySelectorAll('.mdc-button').forEach(value => {
            new mdc.ripple.MDCRipple(value)
        })
        document.querySelectorAll('.mdc-icon-button').forEach(value => {
            let br = new mdc.ripple.MDCRipple(value)
            br.unbounded = true;
        })
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
})

function isLogin() {
    // 로그인 로직
    return false
}

function hasNotify() {
    // 알림 확인
    return true
}