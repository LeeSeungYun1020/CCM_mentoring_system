$(document).ready(() => {
    $(window).resize(moveFooter())
    $.post(`/search/title`, {value: '<%= value %>'}, (res) => {
        $("#search_title").html(makeHTML(res.body))
        moveFooter()
    })
    $.post(`/search/tag`, {value: '<%= value %>'}, (res) => {
        $("#search_tag").html(makeHTML(res.body))
        moveFooter()
    })
    $.post(`/search/contents`, {value: '<%= value %>'}, (res) => {
        $("#search_contents").html(makeHTML(res.body))
        moveFooter()
    })
})

function moveFooter() {
    if ($(window).height() < $(document).height()) {
        $("footer").css("position", "static")
    } else {
        $("footer").css("position", "fixed")
    }
}

function makeHTML(list) {
    let html = ""
    for (const data of list) {
        html += `
<div class="result-box mdc-elevation--z4">
<a href="/board/${data.id}">
<h2>${data.title}</h2>
<p>${data.userID}, 작성: ${convertTime(data.date)}, 수정: ${convertTime(data.modifyDate)}</p>
<div class='mdc-chip-set mdc-chip-set--filter search-chip-box'>
                `.trim()
        const tagList = data.tag.split(" ")
        for (let i = 0; i < tagList.length; i++) {
            html += `
<div class="mdc-chip mdc-ripple-upgraded" id="question_question_chip${i}" role="row">
    <span class="mdc-chip__text" id="question_question_chip${i}_text">${tagList[i]}</span>
</div>
                    `.trim()
        }
        html += "</div></a></div>"
    }
    return html
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