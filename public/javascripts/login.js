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
    $('#login_send_button').click(() => {
        if (loginStatus === LoginStatus.LOGIN) {
            alert("로그인 시도")
        } else if (loginStatus === LoginStatus.SIGNIN) {
            alert("회원가입 시도")
        }
    })

    // default 행동 login으로 설정
    $('#login_type_login_button').trigger("click")
})

function initLogin() {
    document.querySelectorAll('.mdc-text-field').forEach(value => {
        new mdc.textField.MDCTextField(value)
    })
    document.querySelectorAll('.mdc-button').forEach(value => {
        new mdc.ripple.MDCRipple(value)
    })

    if (loginStatus === LoginStatus.LOGIN) {
        setTypeLogin()
    } else if (loginStatus === LoginStatus.SIGNIN) {
        setTypeSignin()
    }
}

function setTypeLogin() {
    $('#login_input_email_label').hide()
    $('#login_input_email_text').removeAttr('required')
    $('#login_send_button').val("로그인")
    $('#login_type_login_button').addClass('mdc-button--unelevated')
    $('#login_type_signin_button').removeClass('mdc-button--unelevated')
}

function setTypeSignin() {
    $('#login_input_email_label').show()
    $('#login_input_email_text').attr('required', 'true')
    $('#login_send_button').val("회원가입")
    $('#login_type_login_button').removeClass('mdc-button--unelevated')
    $('#login_type_signin_button').addClass('mdc-button--unelevated')
}