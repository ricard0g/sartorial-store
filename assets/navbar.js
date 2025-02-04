const navLinks = document.querySelectorAll('.nav-link');
const subNavbarWrapper = document.querySelector('.subnavbar-wrapper');
navLinks.forEach((link, index) => {
  const megaMenu = link.nextElementSibling;
  link.addEventListener('mouseover', () => {
    navLinks.forEach((innerLink, innerIndex) => {
      const innerMegaMenu = innerLink.nextElementSibling;
      if (innerMegaMenu.classList.contains('show') && innerIndex !== index) {
        innerLink.classList.remove('underline');
        innerMegaMenu.classList.remove('show');
        innerMegaMenu.style.display = 'none';
      }
    });
    link.classList.add('underline');
    megaMenu.style.display = 'block';
    setTimeout(() => {
      megaMenu.classList.add('show');
    }, 10);

    subNavbarWrapper.addEventListener('mouseleave', () => {
      link.classList.remove('underline');
      megaMenu.classList.remove('show');
      megaMenu.style.display = 'none';
    });
  });
});
