let isReady = false
$(document).ready(() => {
    if (!isReady) {
        isReady = true
        $('header').load('header.html')
        $('footer').load('footer.html')
    }
})