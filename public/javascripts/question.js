let isAnswer = false
let answerQuill = {}
let updateQuill = {}
let isUpdate = false
let updateID = 0

$(document).ready(() => {
    setField()
    initQuestion()
})

function initQuestion() {
    moveFooter()
    if (`<%= userID %>`.length == 0) {
        $("#question_post_answer_text").text("로그인하셔야 답변을 게시할 수 있습니다.")
        $("#question_post_answer_button").prop("disabled", true)
    }
    $(window).resize(moveFooter())
}

function setField() {
    setQuestionField()
    setAnswerField("time")
    setAnswerEditField()
}

function setQuestionField() {
    const questionField = new Quill('#question_contents', {
        modules: {
            syntax: true
        },
        scrollingContainer: '#question-contents_box',
        placeholder: '질문 내용이 표시됩니다.',
        theme: 'bubble'
    })
    questionField.enable(false)
    $.post(`/board/data/q/<%= id %>`, (body) => {
        if (body.error) {
            if (body.error === "auth")
                alert("해당 게시물을 열람할 수 없습니다.")
            else
                alert("존재하지 않는 게시물입니다.")
            location.href = '/board'
        } else {
            const data = body.data
            $("#question_title").text(data.title)
            $("#question_subtitle").text(
                `${data.name}, 작성: ${convertTime(data.date)}, 수정: ${convertTime(data.modifyDate)}`
            )
            $("#question_point").text(data.point)
            let tagHTML = "<div class='mdc-chip-set mdc-chip-set--filter'>"
            const tagList = data.tag.split(" ")
            for (let i = 0; i < tagList.length; i++) {
                tagHTML += `
<div class="mdc-chip mdc-ripple-upgraded" id="question_question_chip${i}" role="row">
    <span class="mdc-chip__text" id="question_question_chip${i}_text">${tagList[i]}</span>
</div>
                    `.trim()
            }
            tagHTML += "</div>"
            $("#question_tag").html(tagHTML)
            for (let i = 0; i < tagList.length; i++) {
                $(`#question_question_chip${i}`).click(function () {
                    location.href = '/search/' + $(`#question_question_chip${i}_text`).text().toLowerCase()
                })
            }
            if (data.id != `<%= userID %>`) {
                $("#question_question_update").prop("disabled", "true")
                $("#question_question_delete").prop("disabled", "true")
            }
            try {
                questionField.setContents(JSON.parse(data.contents).ops)
            } catch (e) {
                console.log(e)
            }
        }
    })

}

function setAnswerField(sort) {
    getAnswerHTML(sort).then(value => {
        $("#question_answer_view_box").html(value.html)
        addAnswerFieldAddOn(value.list)
        sortAvailable()
        initButton(value.list)
        initAnswerButton(value.list)
        initRecommend()
        moveFooter()
        if (sort === "vote")
            $("#question_answer_sort_recommend").prop("checked", true)
    }).catch(error => {
        alert("해당 게시물을 열람할 수 없습니다.")
        location.href = '/board'
    })
}

function getAnswerHTML(sort) {
    return new Promise(function (resolve, reject) {
        $.post(`/board/data/a/<%= id %>`, (body) => {
            if (body.error) {
                return reject(body.error)
            } else if (body.data.length === 0) {
                return resolve({
                    html: `
                        <h3>아직 답변이 없습니다.</h3>
                        <p>지금 바로 답변해보세요.</p>
                    `.trim(), list: body.data
                })
            } else {
                isAnswer = true
                let content = `
<div class="question_answer_header">
<h3 class="fill-left">${body.data.length}개의 답변이 있습니다.</h3>
<div class="mdc-form-field">
  <div class="mdc-radio">
    <input class="mdc-radio__native-control" type="radio" id="question_answer_sort_time" name="radios" checked>
    <div class="mdc-radio__background">
      <div class="mdc-radio__outer-circle"></div>
      <div class="mdc-radio__inner-circle"></div>
    </div>
    <div class="mdc-radio__ripple"></div>
  </div>
  <label for="question_answer_sort_time">시간순</label>
</div>
<div class="mdc-form-field">
  <div class="mdc-radio">
  <input class="mdc-radio__native-control" type="radio" id="question_answer_sort_recommend" name="radios">
    <div class="mdc-radio__background">
      <div class="mdc-radio__outer-circle"></div>
      <div class="mdc-radio__inner-circle"></div>
    </div>
    <div class="mdc-radio__ripple"></div>
  </div>
  <label for="question_answer_sort_recommend">추천순</label>
</div>
</div>`.trim()
                if (sort === "vote") {
                    body.data.sort((a, b) => b.point - a.point)
                }
                for (const answer of body.data) {
                    content += `
<div class="question_box">
<div id="question_recommend_box_answer${answer.id}" class="recommend_box">
    <button aria-label="추천"
            aria-pressed="false"
            class="mdc-icon-button"
            id="question_recommend_up${answer.id}">
        <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">thumb_up</i>
        <i class="material-icons material-icons-outlined mdc-icon-button__icon">thumb_up</i>
    </button>
    <section id="question_point_answer${answer.id}" class="point">${answer.point}</section>
    <button aria-label="비추천"
            aria-pressed="false"
            class="mdc-icon-button"
            id="question_recommend_down${answer.id}">
        <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">thumb_down</i>
        <i class="material-icons material-icons-outlined mdc-icon-button__icon">thumb_down</i>
    </button>
</div>
<div id="question_answers_box${answer.id}" class="contents_box">
    <article id="question_answers${answer.id}" class="contents">내용</article>
    <div class="fill-box">
        <section id="question_answers${answer.id}_subtitle" class="question_box_footer fill-left"></section>
        <button class="mdc-button mdc-button--unelevated ud-button" id="question_answers${answer.id}_update_button" type="button">
            <span class="mdc-button__ripple"></span>
            수정
        </button>
        <button class="mdc-button mdc-button--unelevated ud-button" id="question_answers${answer.id}_delete_button" type="button">
            <span class="mdc-button__ripple"></span>
            삭제
        </button>
    </div>
</div>
</div>
<div id="question_answer_update_box${answer.id}" class="contents_box">
<form action="/edit/answer/update/${answer.id}" id="answer_update_form${answer.id}" method="post">
    <input name="questionID" type="hidden" value="<%= id %>">
    <input name="contents_answer${answer.id}" type="hidden">
    <article id="question_answers${answer.id}_update" class="contents">내용</article>
    <div class="fill-box">
        <section class="question_box_footer fill-left">
        수정 버튼을 누르면 수정 사항이 반영됩니다.
        </section>
        <button class="mdc-button mdc-button--unelevated ud-button" id="question_answers${answer.id}_update_send" type="submit">
            <span class="mdc-button__ripple"></span>
            수정
        </button>
        <button class="mdc-button mdc-button--unelevated ud-button" id="question_answers${answer.id}_update_cancel" type="button">
            <span class="mdc-button__ripple"></span>
            취소
        </button>
    </div>
</form>
</div>
<hr>
                        `.trim()
                }
                resolve({html: content, list: body.data})
            }
        })
    })
}

function addAnswerFieldAddOn(list) {
    for (const answer of list) {
        let tem = new Quill(`#question_answers${answer.id}`, {
            modules: {
                syntax: true,
            },
            placeholder: '답변 내용이 표시됩니다.',
            theme: 'bubble'
        })
        tem.enable(false)
        try {
            tem.setContents(JSON.parse(answer.contents).ops)
        } catch (e) {
            console.log(e)
        }
        answerQuill[`q${answer.id}`] = tem
        $.post(`/users/username/${answer.userID}`, (user) => {
            $(`#question_answers${answer.id}_subtitle`).text(
                `${user.name}, 작성: ${convertTime(answer.date)}, 수정: ${convertTime(answer.modifyDate)}`)
        })
        $(`#question_answer_update_box${answer.id}`).hide()
        $(`#answer_update_form${answer.id}`).submit((event) => {
            const uQuill = updateQuill[`q${answer.id}`]
            if (uQuill == null) {
                alert("잘못된 접근입니다.")
                return false
            }
            if (uQuill.getLength() <= 1) {
                alert("내용을 입력해주세요.")
                return false
            }
            const contents = document.querySelector(`input[name=contents_answer${answer.id}]`);
            contents.value = JSON.stringify(uQuill.getContents());
            return true
        })
    }
}

function sortAvailable() {
    $("#question_answer_sort_recommend").click(() => {
        setAnswerField("vote")
    })
    $("#question_answer_sort_time").click(() => {
        setAnswerField("time")
    })
}

function setAnswerEditField() {
    const editField = new Quill('#question_answer_edit', {
        modules: {
            syntax: true,
            toolbar: [
                ['bold', 'italic', 'underline'],
                ['link', 'blockquote', 'code-block', 'image'],
                [{list: 'ordered'}, {list: 'bullet'}]
            ]
        },
        placeholder: '내 의견을 입력해보세요.',
        theme: 'snow'
    })
    $("#answer_form").submit((event) => {
        if (editField.getLength() <= 1) {
            alert("내용을 입력해주세요.")
            return false
        }
        const contents = document.querySelector('input[name=contents]');
        contents.value = JSON.stringify(editField.getContents());
        return true
    })
}

function initRecommend() {
    document.querySelectorAll('.mdc-icon-button').forEach(value => {
        const toggleButton = new mdc.iconButton.MDCIconButtonToggle(value)
        toggleButton.listen('MDCIconButtonToggle:change', function (e) {
            const id = e.target.id
            const isOn = e.detail.isOn
            if ((id == 'question_recommend_down' && isOn) || id == 'question_recommend_up' && !isOn) {
                $.post(`/board/recommend/q/minus/<%= id %>`, (res) => {
                    if (!res.error) {
                        $.post(`/users/recommend/q/minus/<%= userID %>`)
                        const text = $(`#question_point`).text()
                        $(`#question_point`).text(parseInt(text, 10) - 1)
                    }
                })
            } else if ((id == 'question_recommend_down' && !isOn) || id == 'question_recommend_up' && isOn) {
                $.post(`/board/recommend/q/add/<%= id %>`, (res) => {
                    if (!res.error) {
                        $.post(`/users/recommend/q/add/<%= userID %>`)
                        const text = $(`#question_point`).text()
                        $(`#question_point`).text(parseInt(text, 10) + 1)
                    }

                })
            } else if (id.includes("down")) {
                const target = id.replace("question_recommend_down", "")
                if (isOn)
                    minusAnswerPoint(target)
                else
                    addAnswerPoint(target)
            } else if (id.includes("up")) {
                const target = id.replace("question_recommend_up", "")
                if (isOn)
                    addAnswerPoint(target)
                else
                    minusAnswerPoint(target)
            }

        })
    })
}

function addAnswerPoint(target) {
    $.post(`/board/recommend/a/add/${target}`, (res) => {
        if (!res.error) {
            $.post(`/users/recommend/a/add/${res.userID}`, (res) => {
                console.log(res.error)
            })
            const text = $(`#question_point_answer${target}`).text()
            $(`#question_point_answer${target}`).text(parseInt(text, 10) + 1)
        }

    })
}

function minusAnswerPoint(target) {
    $.post(`/board/recommend/a/minus/${target}`, (res) => {
        if (!res.error) {
            $.post(`/users/recommend/a/minus/${res.userID}`, (res) => {

            })
            const text = $(`#question_point_answer${target}`).text()
            $(`#question_point_answer${target}`).text(parseInt(text, 10) - 1)
        }

    })
}

function moveFooter() {
    if ($(window).height() < $(document).height()) {
        $("footer").css("position", "static")
    } else {
        $("footer").css("position", "fixed")
    }
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

function initButton(list) {
    $("#question_question_update").click(() => {
        if (isAnswer) {
            alert("답변이 등록된 경우 게시물을 수정할 수 없습니다.\n답변을 추가하여 문제를 해결해보세요.")
            return
        }
        location.href = '/edit/<%= id %>'
    })
    $("#question_question_delete").click(() => {
        if (isAnswer) {
            alert("답변이 등록된 경우 게시물을 삭제할 수 없습니다.")
            return
        }
        $.post('/edit/question/delete/<%= id %>', (body) => {
            if (body.isSuccess === true) {
                alert("게시물이 삭제되었습니다.")
                location.href = '/board'
            } else {
                alert("게시물 삭제에 실패하였습니다.")
            }
        })
    })
}

function initAnswerButton(list) {
    for (const answer of list) {
        if (`<%= userID %>` != answer.userID) {
            $(`#question_answers${answer.id}_update_button`).prop("disabled", "true")
            $(`#question_answers${answer.id}_delete_button`).prop("disabled", "true")
        }
        $(`#question_answers${answer.id}_update_button`).click(() => {
            if (isUpdate) {
                if (updateID !== answer.id) {
                    alert("이미 수정 중인 글이 있습니다.")
                    return
                } else return
            }
            const quill = answerQuill[`q${answer.id}`]
            if (quill != null) {
                isUpdate = true
                updateID = answer.id
                $(`#question_answers${answer.id}_update_button`).prop("disabled", true)
                $(`#question_answer_update_box${answer.id}`).show()
                if (updateQuill[`q${answer.id}`] == null) {
                    let editField = new Quill(`#question_answers${answer.id}_update`, {
                        modules: {
                            syntax: true,
                            toolbar: [
                                ['bold', 'italic', 'underline'],
                                ['link', 'blockquote', 'code-block', 'image'],
                                [{list: 'ordered'}, {list: 'bullet'}]
                            ]
                        },
                        placeholder: '답변 내용이 표시됩니다.',
                        theme: 'snow'
                    })
                    updateQuill[`q${answer.id}`] = editField
                }
                const uQuill = updateQuill[`q${answer.id}`]
                uQuill.setContents(quill.getContents())
                uQuill.focus()
            } else {
                alert("수정할 수 없는 글입니다.")
            }
        })
        $(`#question_answers${answer.id}_update_cancel`).click(() => {
            isUpdate = false
            updateID = 0
            $(`#question_answers${answer.id}_update_button`).prop("disabled", false)
            $(`#question_answer_update_box${answer.id}`).hide()
        })
        $(`#question_answers${answer.id}_delete_button`).click(() => {
            $.post(`/edit/answer/delete/${answer.id}`, (body) => {
                if (body.isSuccess === true) {
                    alert("답변이 삭제되었습니다.")
                    location.href = '/board/<%= id %>'
                } else {
                    alert("답변 삭제에 실패하였습니다.")
                }
            })
        })
    }
}