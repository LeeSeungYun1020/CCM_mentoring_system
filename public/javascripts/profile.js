$(document).ready(() => {
    initHeader()

    function initHeader() {
        // 로그인 확인
        $.post('/users/', (data) => {
            $("#user_profile_picture_info").attr("src", `/images/user${data.image}.jpg`)
            $("#user_profile_name_info").text(data.name)
            $("#user_profile_id_info").text(data.id)
            $("#user_profile_email_info").text(data.email)
            $("#user_profile_phone_info").text(data.phone)
            $("#user_profile_questionPoint_info").text('질문점수 : '+data.questionPoint)
            $("#user_profile_answerPoint_info").text('답변점수 : '+data.answerPoint)
            if(data.teamID != null) {
                $.post(`/users/team/${data.teamID}`, (team) => {
                    console.log(team)
                    $(".user_profile_team_info")
                })
            }

        })


    }
})