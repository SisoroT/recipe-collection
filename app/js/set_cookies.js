function setCookie(name, value, days) {
    let expires = ''
    if (days) {
        const date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = '; expires=' + date.toUTCString()
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

function getCookie(name) {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
}

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.querySelector('.login-btn')

    function checkLoginCookie() {
        const loginCookieValue = getCookie('login')
        return loginCookieValue && loginCookieValue === 'logged_in'
    }

    if (checkLoginCookie()) {
        loginButton.textContent = 'Logout'
        loginButton.addEventListener('click', function () {
            document.cookie = 'login=logged_out; path=/'
            window.location.href = 'index.html' // Redirects to the homepage
        })
    } else {
        loginButton.addEventListener('click', function () {
            window.location.href = 'login_signup.html'
        })
    }
})
