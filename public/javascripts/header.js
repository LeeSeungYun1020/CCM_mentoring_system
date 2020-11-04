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
let user
let dialog

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

    // 사용자 및 알림 다이얼로그
    dialog.listen('MDCDialog:opened', () => {
        console.log("dialog open")
    })

    const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
    const listEl = document.querySelector('.mdc-drawer .mdc-list');
    const mainContentEl = document.querySelector('#header_main_contents');

    listEl.addEventListener('click', (event) => {
        drawer.open = false;
    });

    document.body.addEventListener('MDCDrawer:closed', () => {
        mainContentEl.querySelector('input, button').focus();
    })

    $("#main_navigation_menu_icon").click(() => {
        drawer.open = !drawer.open
    })

    function initHeader() {
        // 로그인 확인
        $.post('/users/', (data) => {
            user = data
            if (user) {
                $("#login_login_icon").hide()
                $("#login_logout_icon").show()
                $("#notification").show()
                checkNotification()
            } else {
                $("#login_login_icon").show()
                $("#login_logout_icon").hide()
                $("#notification").hide()
            }
        })
        // 컴포넌트 초기화
        initComponents()
        // 검색창 숨김
        $('#main_search_box_header').hide()
    }

    function initComponents() {
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
        document.querySelectorAll('.mdc-dialog').forEach(value => {
            dialog = new mdc.dialog.MDCDialog(value)
        })
    }

    function checkNotification() {
        if (user.notice) {
            $("#notification_exist_icon").show()
            $("#notification_none_icon").hide()
        } else {
            $("#notification_exist_icon").hide()
            $("#notification_none_icon").show()
        }
    }
})

function updateUserData() {
    $.post('/users/', (data) => {
        user = data

    })
}