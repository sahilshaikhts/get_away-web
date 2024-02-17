window.addEventListener('load', () => {
        const button_play = document.getElementsByClassName('btn_play')[0];
    if (button_play) {
        button_play.addEventListener('click', () => {
            document.location.href = "./game-screen.html"
        })
    }
})
