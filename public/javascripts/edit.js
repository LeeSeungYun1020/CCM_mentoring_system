$(document).ready(() => {
    let chipList = []

    initField()

    function initField() {
        document.querySelectorAll('.mdc-text-field').forEach(value => {
            new mdc.textField.MDCTextField(value)
        })
        document.querySelectorAll('.mdc-button').forEach(value => {
            new mdc.ripple.MDCRipple(value)
        })
        const editField = new Quill('#edit_contents', {
            modules: {
                syntax: true,
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    ['link', 'blockquote', 'code-block', 'image'],
                    [{list: 'ordered'}, {list: 'bullet'}]
                ]
            },
            placeholder: '질문 또는 토론할 내용을 입력해보세요.\n질문 입력시에는 답변에 필요한 모든 정보를 입력해주세요.',
            theme: 'snow'
        })
        $("#edit_form").submit((event) => {
            if (event.key === "enter") {
                event.preventDefault()
                return false
            }
            if (editField.getLength() <= 1) {
                alert("내용을 입력해주세요.")
                return false
            }
            const contents = document.querySelector('input[name=contents]')
            contents.value = JSON.stringify(editField.getContents())
            const tags = document.querySelector('input[name=tag]')
            tags.value = chipList.toString().replaceAll(",", " ").toUpperCase()
            return true
        })
        $("#edit_input_tag").keydown((event) => {
            if (event.key === "Enter")
                event.preventDefault()
            if (event.key === "Backspace" && $("#edit_input_tag").val().length === 0) {
                if (chipList.length > 0) {
                    chipList.pop()
                    drawChip()
                }
            }
        })
        $("#edit_input_tag").keyup(function (event) {
            if (event.key === "Enter" || event.key === " " || event.key === "\,") {
                let data = $("#edit_input_tag").val()
                    .toUpperCase()
                    .replaceAll(",", "")
                    .replaceAll(" ", "")
                if (data.length > 0) {
                    chipList.push(data)
                    console.log(chipList.toString().length)
                    if (chipList.toString().length > 64) {
                        alert("더이상 태그를 추가할 수 없습니다.")
                        chipList.pop()
                    } else {
                        drawChip()
                    }
                    $("#edit_input_tag").val("")
                }
            }
        })
    }

    function drawChip() {
        let replace = ""
        chipList.forEach(function (data, i, array) {
            replace += `
<div class="mdc-chip mdc-ripple-upgraded" role="row">
    <span class="mdc-chip__text" tabindex="1">${data}</span>
    <i class="material-icons mdc-chip__icon mdc-chip__icon--trailing" id="edit_chip${i}_button" tabindex="-1" role="button">cancel</i>
</div>
                            `.trim()
        })
        $("#edit_tag_chip_box").html(replace)
        for (let i = 0; i < chipList.length; i++) {
            $(`#edit_chip${i}_button`).click(() => {
                deleteChip(i)
            })
        }
        $("#edit_input_tag").css("margin-left", $("#edit_tag_chip_box").css("width"))
    }

    function deleteChip(index) {
        chipList.splice(index, 1)
        drawChip()
    }
})