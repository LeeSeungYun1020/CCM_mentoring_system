$(document).ready(() => {
    initHeader()
    let page = 0
    let count = 10
    let maxPage = 0
    let type = "list"

    function initHeader() {
        // 로그인 확인
        $.post('/users/', (data) => {
            $("#user_profile_picture_info").attr("src", `/images/user${data.image}.jpg`)
            $("#user_profile_name_info").text(data.name)
            $("#user_profile_id_info").text(data.id)
            $("#user_profile_email_info").text(data.email)
            $("#user_profile_phone_info").text(data.phone)
            $("#user_profile_questionPoint_info").text(data.questionPoint)
            $("#user_profile_answerPoint_info").text(data.answerPoint)
            if(data.teamID != null) {
                $.post(`/users/team/${data.teamID}`, (team) => {
                    console.log(team)
                    $(".user_profile_team_info")
                })
            }

        })
    }

    function update(page, count, type) {
        return new Promise(function (resolve, reject) {
            $.post(`/board/data/list/0/3`, (body) => {
                const err = body.error
                const list = body.list
                if (err) {
                    console.log(err)
                    reject(err)
                    return
                }

                let contents = ""
                for (const data of list) {
                    contents += `
                                <tr class="mdc-data-table__row" onClick = "location.href='/board/${data.id}'">
                                <th class="mdc-data-table__cell" scope="row">${data.title}</th>
                                <td class="mdc-data-table__cell">${data.name}</td>
                                <td class="mdc-data-table__cell">${convertTime(data.date)}</td>
                                </tr>
                                `.trim()
                    convertTime(data.date)
                }
                $('#board_data_table_contents').html(contents)
                resolve(true)
            })
        })
    }

    function convertTime(stringTime) {
        const date = new Date()
        date.setTime(Date.parse(stringTime))
        const delay = Date.now() - date.getTime()
        if (delay < 1000 * 60) // 1분 이하
            return `${Math.round(delay / 1000)} 초 전`
        if (delay < 1000 * 60 * 60) // 1시간 이하
            return `${Math.round(delay / 1000 / 60)} 분 전`
        if (delay < 1000 * 60 * 60 * 24) // 1일 이하
            return `${Math.round(delay / 1000 / 60 / 60)} 시간 전`
        if (delay < 1000 * 60 * 60 * 24 * 365) // 1년 이하
            return `${Math.round(delay / 1000 / 60 / 60 / 24)} 일 전`
        else
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
    }

    $(window).resize(() => {
        moveContents()
    })
    function moveContents() {
        const width = $(window).width()
        if (width < 850) {
            // $(".mentor_profile_text").text("I")
            // $(".mentor_question_point").text("질문: ")
            // $(".mentor_answer_point").text("답변: ")
            $(".main_contents").css("width", "100%")
            $(".main_contents").css("left", "0")
        } else if (width < 1300) {
            // $(".mentor_profile_text").text("프로필")
            // $(".mentor_question_point").text("질문: ")
            // $(".mentor_answer_point").text("답변: ")
            $(".main_contents").css("width", "80%")
            $(".main_contents").css("left", "10%")
        } else {
            // $(".mentor_profile_text").text("프로필 보기")
            // $(".mentor_question_point").text("질문 점수: ")
            // $(".mentor_answer_point").text("답변 점수: ")
            $(".main_contents").css("width", "70%")
            $(".main_contents").css("left", "15%")
        }
    }
})