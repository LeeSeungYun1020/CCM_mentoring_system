$(document).ready(() => {
    document.querySelectorAll('.mdc-list').forEach(value => {
        new mdc.list.MDCList(value)
    })
    const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
    const listEl = document.querySelector('.mdc-drawer .mdc-list');
    const mainContentEl = document.querySelector('.main_contents');

    listEl.addEventListener('click', (event) => {
        drawer.open = false
    });

    document.body.addEventListener('MDCDrawer:closed', () => {
        mainContentEl.querySelector('input, button').focus()
    })

    $("#main_navigation_menu_icon").click(() => {
        drawer.open = !drawer.open
    })
})