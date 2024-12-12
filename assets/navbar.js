const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('mouseover', (e) => {
        const megaMenu = e.target.nextElementSibling;
        megaMenu.classList.add('show');
    })
})