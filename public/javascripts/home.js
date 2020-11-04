// TODO("Home 화면 기능 링크")
$(document).ready(() => {
    $("#home_question").click(() => {
        if (contents !== MainContents.QUESTION) {
            contents = MainContents.QUESTION
            $("#main_contents").load("question.html")
        }
    })
})
