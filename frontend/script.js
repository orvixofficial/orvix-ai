function handleStartChat() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        window.location.href = 'chat.html';
    } else {
        window.location.href = 'login.html';
    }
}
