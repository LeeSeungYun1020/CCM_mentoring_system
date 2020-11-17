$(window).ready(() => {
    let page = 0
    let count = 10
    let maxPage = 0
    let type = "list"
    calcMaxPage(count, type).then((result) => {
        maxPage = result
    })
    new mdc.dataTable.MDCDataTable(document.querySelector('.mdc-data-table'))
    update(page, count, type)
    const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'))
    select.listen('MDCSelect:change', () => {
        page = 0
        count = select.value
        calcMaxPage(count, type).then((result) => {
            maxPage = result
            console.log(maxPage)
            if (page > maxPage)
                page = maxPage
            update(page, count, type)
            firstPage(page === 0)
            lastPage(page === maxPage)
        })
    })

    $(window).resize(moveFooter())

    $('#board_type_team_button').removeClass('mdc-button--unelevated')
    $('#board_type_team_button').click(() => {
        if (type !== "team") {
            type = "team"
            $('#board_type_team_button').addClass('mdc-button--unelevated')
            $('#board_type_general_button').removeClass('mdc-button--unelevated')
            update(page, count, type).catch(reason => {
                if (reason === "login") {
                    alert("로그인하셔야 팀 게시판을 조회할 수 있습니다.")
                    let result = confirm("로그인하시겠습니까?")
                    if (result) {
                        location.href = '/users'
                        return
                    }
                } else if (reason === "team") {
                    alert("아직 참가하고 있는 팀이 없습니다.")
                } else if (reason === "data") {
                    alert("데이터가 존재하지 않습니다.")
                }
                $('#board_type_general_button').trigger("click")
            })
        }
    })
    $('#board_type_general_button').click(() => {
        if (type !== "list") {
            type = "list"
            $('#board_type_general_button').addClass('mdc-button--unelevated')
            $('#board_type_team_button').removeClass('mdc-button--unelevated')
            update(page, count, type)
        }
    })
    $("#board_edit_button").click(() => {
        if (type === "team")
            location.href = "/edit/team"
        else
            location.href = "/edit"
    })
    $("#board_first_button").click(() => {
        page = 0
        firstPage(true)
        lastPage(page === maxPage)
        update(page, count, type)
    })
    $("#board_minus_button").click(() => {
        if (page > 0) {
            page--
        } else {
            alert("첫번째 페이지입니다.")
        }
        firstPage(page === 0)
        lastPage(page === maxPage)
        update(page, count, type)
    })
    $("#board_last_button").click(() => {
        page = maxPage
        lastPage(true)
        firstPage(page === 0)
        update(page, count, type)
    })
    $("#board_plus_button").click(() => {
        page++
        firstPage(false)
        update(page, count, type).then((result) => {
            if (result === false)
                page--
        })
        firstPage(page === 0)
        lastPage(page === maxPage)
    })
})

function update(page, count, type) {
    return new Promise(function (resolve, reject) {
        $.post(`/board/data/${type}/${page}/${count}`, (body) => {
            const err = body.error
            const list = body.list
            if (err) {
                console.log(err)
                reject(err)
                return
            }
            if (list.length === 0) {
                if (page !== 0) {
                    alert("마지막 페이지 입니다.")
                    lastPage(true)
                    resolve(false)
                } else {
                    $('#board_data_table_contents').html(`
                                <tr class="mdc-data-table__row">
                                <th class='mdc-data-table__cell'>저장된 데이터가 없습니다.</th>
                                </tr>`.trim())
                }
            } else {
                let contents = ""
                for (const data of list) {
                    contents += `
                                <tr class="mdc-data-table__row" onClick = "location.href='/board/${data.id}'">
                                <th class="mdc-data-table__cell" scope="row">${data.title}</th>
                                <td class="mdc-data-table__cell">${data.name}</td>
                                <td class="mdc-data-table__cell">${convertTime(data.date)}</td>
                                <td class="mdc-data-table__cell">${data.tag}</td>
                                </tr>
                                `.trim()
                    convertTime(data.date)
                }
                $('#board_data_table_contents').html(contents)
                $('#board_page_text').text(`${page + 1} 페이지`)
                moveFooter()
                resolve(true)
            }
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

function calcMaxPage(count, type) {
    return new Promise(function (resolve, reject) {
        $.post(`board/data/count/${type}`, (body) => {
            if (body.error) reject(error)
            else {
                const data = parseInt(body.data, 10)
                resolve(Math.ceil(data / count) - 1)
            }
        })
    })
}

function lastPage(state) {
    $("#board_last_button").attr('disabled', state)
    $("#board_plus_button").attr('disabled', state)
}

function firstPage(state) {
    $("#board_first_button").attr('disabled', state)
    $("#board_minus_button").attr('disabled', state)
}

function moveFooter() {
    if ($(window).height() < $(document).height()) {
        $("footer").css("position", "static")
    } else {
        $("footer").css("position", "fixed")
    }
}