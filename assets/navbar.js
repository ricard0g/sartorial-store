const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('mouseover', (e) => {
        const megaMenu = e.target.nextElementSibling;
        megaMenu.classList.add('show');
        megaMenu.addEventListener('mouseover', (e) => {
            megaMenu.classList.add('show')
        });
        megaMenu.addEventListener('mouseout', (e) => {
            megaMenu.classList.remove('show')
        })
    });

    link.addEventListener('mouseout', (e) => {
       const megaMenu = e.target.nextElementSibling;
       megaMenu.classList.remove('show');
    })
})