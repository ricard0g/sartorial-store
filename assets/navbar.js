const navLinks = document.querySelectorAll('.nav-link');
const subNavbarWrapper = document.querySelector('.subnavbar-wrapper');
console.log(navLinks);
navLinks.forEach((link, index) => {
  const megaMenu = link.nextElementSibling;
  console.log(megaMenu);
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
    }, 150);

    subNavbarWrapper.addEventListener('mouseleave', () => {
      megaMenu.classList.remove('show');
      megaMenu.style.display = 'none';
    });
  });
});
