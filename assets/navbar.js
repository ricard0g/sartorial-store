const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach((link) => {
  link.addEventListener('mouseover', (e) => {
    link.classList.add('underline');
    const megaMenu = e.target.nextElementSibling;
    megaMenu.style.display = 'block';
    setTimeout(() => {
      megaMenu.classList.add('show');
    }, 100);
    megaMenu.addEventListener('mouseover', (e) => {
      megaMenu.style.display = 'block';
      megaMenu.classList.add('show');
    });
    megaMenu.addEventListener('mouseout', (e) => {
      megaMenu.classList.remove('show');
      megaMenu.style.display = 'none';
      setTimeout(() => {
        if (megaMenu.style.display === "none") {
            link.classList.remove('underline');
        }
      }, 100)
    });
  });

  link.addEventListener('mouseout', (e) => {
    const megaMenu = e.target.nextElementSibling;
    if (!megaMenu.classList.contains('show')) {
      megaMenu.classList.remove('show');
      megaMenu.style.display = 'none';
    }
  });
});
