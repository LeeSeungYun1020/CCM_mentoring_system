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

    $("#login_logout_icon").click(() => {
        if ($("#main_login_card").css("display") == "none")
            $("#main_login_card").show()
        else
            $("#main_login_card").hide()
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
            //$(this).val("")
            //$("#main_search_box_header").hide()
            location.href = '/search/' + this.value
        }
    })

    // 사용자 및 알림 다이얼로그
    dialog.listen('MDCDialog:opened', () => {
        console.log("dialog open")
    })

    function initHeader() {
        // 로그인 확인
        $.post('/users/', (data) => {
            user = data
            if (user) {
                $("#login_login_icon").hide()
                $("#login_logout_icon").show()
                $("#notification").show()
                $("#info_simple_name").text(data.name)
                $("#info_simple_id").text(data.id)
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
        // 사용자 카드 숨김
        $("#main_login_card").hide()
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