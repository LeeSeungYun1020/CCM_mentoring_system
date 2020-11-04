$(document).ready(() => {
    $("#home_question").click(() => {
        location.href = '/edit'
    })
    $("#home_answer").click(() => {
        location.href = '/board'
    })
    $("#home_mentor").click(() => {
        location.href = '/mentor'
    })
})