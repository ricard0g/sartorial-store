const navLinks = document.querySelectorAll('.nav-link');
const subNavbarWrapper = document.querySelector('.subnavbar-wrapper');

navLinks.forEach((link) => {
    const megaMenu = link.nextElementSibling;
    link.addEventListener('mouseover', (e) => {
        link.classList.toggle('underline');
        megaMenu.style.display = 'block';
        megaMenu.classList.add('show');
    });

    link.addEventListener('mouseleave', () => {
        link.classList.toggle('underline');
        megaMenu.classList.remove('show');
        megaMenu.style.display = 'none';
    })
});

subNavbarWrapper.addEventListener('mouseover', () => {
    megaMenu.classList.add('show');
})