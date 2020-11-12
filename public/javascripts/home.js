$(document).ready(() => {
    $("#question_hover").click(() => {
        location.href = '/edit'
    })
    $("#answer_hover").click(() => {
        location.href = '/board'
    })
    $("#mentor_hover").click(() => {
        location.href = '/mentor'
    })

    $("#question_icon").hide();
    $("#answer_icon").hide();
    $("#mentor_icon").hide();

    $( "#question_hover" ).hover(function() {
        $( "#home_question" ).css("opacity", "0.5");
        $("#question_icon").show();
    }, function () {
        $( "#home_question" ).css("opacity", "1");
        $("#question_icon").hide();
    });

    $( "#answer_hover" ).hover(function() {
        $( "#home_answer" ).css("opacity", "0.5");
        $("#answer_icon").show();
    }, function () {
        $( "#home_answer" ).css("opacity", "1");
        $("#answer_icon").hide();
    });

    $( "#mentor_hover" ).hover(function() {
        $( "#home_mentor" ).css("opacity", "0.5");
        $("#mentor_icon").show();
    }, function () {
        $( "#home_mentor" ).css("opacity", "1");
        $("#mentor_icon").hide();
    });

    console.log($(window).height())
    console.log($(document).height())
    $(window).resize(() => {
        // if ($(window).height() < $(document).height()) {
            $(".home-cell").css("height", $(window).height()-135)

    })
    $(".home-cell").css("height", $(window).height()-135)
})