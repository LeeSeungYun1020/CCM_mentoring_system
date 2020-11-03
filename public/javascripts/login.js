const LoginStatus = {
    LOGIN: {value: "로그인"},
    SIGNIN: {value: "회원가입"}
}
let loginStatus = LoginStatus.LOGIN

$(document).ready(() => {
    initLogin()

    $('#login_type_login_button').click(() => {
        if (loginStatus !== LoginStatus.LOGIN) {
            loginStatus = LoginStatus.LOGIN
            setTypeLogin()
        }
    })
    $('#login_type_signin_button').click(() => {
        if (loginStatus !== LoginStatus.SIGNIN) {
            loginStatus = LoginStatus.SIGNIN
            setTypeSignin()
        }
    })

    const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));

    select.listen('MDCSelect:change', () => {
        $("#login_input_type_text").val(select.selectedIndex)
    })

    $('#login_next_button').click(() => {
        console.log()
        if (document.getElementById('login_input_id_text').validity.valid &&
            document.getElementById('login_input_pw_text').validity.valid &&
            document.getElementById('login_input_email_text').validity.valid) {
            showSignInAddition()
        }
    })
    $('#login_find_id_button').click(() => {
        alert("아이디는 학번입니다.")
    })
    $('#login_find_pw_button').click(() => {
        location.href = '/users/pw'
    })

    $(window).resize(() => {
        $("#login_contents_box").height($(window).height() - 60)
    })

})

function initLogin() {
    document.querySelectorAll('.mdc-text-field').forEach(value => {
        new mdc.textField.MDCTextField(value)
    })
    document.querySelectorAll('.mdc-button').forEach(value => {
        new mdc.ripple.MDCRipple(value)
    })

    console.log(sessionStorage.getItem('loginStatus'))

    if (loginStatus === LoginStatus.LOGIN) {
        setTypeLogin()
        $('#login_type_login_button').trigger("click")
    } else if (loginStatus === LoginStatus.SIGNIN) {
        setTypeSignin()
        $('#login_type_signin_button').trigger("click")
    }

    $("#login_contents_box").height($(window).height() - 60)
    $("#login_input_type_text").val(0)
}

function setTypeLogin() {
    hideSignInAddition()
    $('#login_input_id_label').show()
    $("#login_input_pw_label").show()
    $('#login_input_email_label').hide()
    $('#login_input_email_text').removeAttr('required')
    $('#login_send_button').val("로그인")
    $('#login_type_login_button').addClass('mdc-button--unelevated')
    $('#login_type_signin_button').removeClass('mdc-button--unelevated')
    $('#login_form').attr('action', 'users/login')
    $('#login_next_button').hide()
    $('#login_send_button').show()
}

function setTypeSignin() {
    hideSignInAddition()
    $('#login_input_id_label').show()
    $("#login_input_pw_label").show()
    $('#login_input_email_label').show()
    $('#login_input_email_text').attr('required', 'true')
    $('#login_send_button').val("회원가입")
    $('#login_type_login_button').removeClass('mdc-button--unelevated')
    $('#login_type_signin_button').addClass('mdc-button--unelevated')
    $('#login_form').attr('action', 'users/signin')
    $('#login_next_button').show()
    $('#login_send_button').hide()
}

function hideSignInAddition() {
    $('#login_input_name_label').hide()
    $('#login_input_name_text').removeAttr('required')
    $('#login_input_phone_label').hide()
    $('#login_input_phone_text').removeAttr('required')
    $('#login_input_type_dropdown').hide()
}

function showSignInAddition() {
    $('#login_input_id_label').hide()
    $("#login_input_pw_label").hide()
    $("#login_input_email_label").hide()
    $('#login_next_button').hide()
    $('#login_send_button').show()
    $('#login_input_name_label').show()
    $('#login_input_name_text').attr('required', 'true')
    $('#login_input_phone_label').show()
    $('#login_input_phone_text').attr('required', 'true')
    $('#login_input_type_dropdown').show()
}