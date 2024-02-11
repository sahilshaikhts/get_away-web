window.addEventListener('load', () => {
        const button_play = document.getElementsByClassName('btn_play')[0];
    if (button_play) {
        window.addEventListener('click', () => {
            document.location.href = "./game-screen.html"
        })
    }
})
