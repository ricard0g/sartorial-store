// Showing Menu Drawer on Hamburger Btn Click

const hamburgerBtn = document.getElementById('hamburger-btn-mobile');
const firstLineHamburger = document.getElementById('first-line-hamburguer');
const secondLineHamburger = document.getElementById('second-line-hamburguer');
const thirdLineHamburger = document.getElementById('third-line-hamburguer');
const menuDrawer = document.querySelector('.mobile-navbar__container');
const backgroundNavbarMobile = document.querySelector('.mobile-navbar__container-background');

const handleHamburgerBtnClick = () => {
    firstLineHamburger.classList.toggle('first-line');
    secondLineHamburger.classList.toggle('second-line');
    thirdLineHamburger.classList.toggle('third-line');
    menuDrawer.style.display = menuDrawer.style.display === 'none' ? 'block' : 'none';
    setTimeout(() => {
        menuDrawer.style.opacity = menuDrawer.style.opacity === '0' ? '1' : '0';
    }, 10);
};

const handleClickOnNavbarBg = () => {
    firstLineHamburger.classList.remove('first-line');
    secondLineHamburger.classList.remove('second-line');
    thirdLineHamburger.classList.remove('third-line');
    menuDrawer.style.display = 'none';
    menuDrawer.style.opacity = '0';
};

hamburgerBtn.addEventListener('click', handleHamburgerBtnClick);
backgroundNavbarMobile.addEventListener('click', handleClickOnNavbarBg);

// Mega Menu List on Mobile
// const linksDrawer = document.querySelectorAll('.mobile-navbar__primary-inner-link');
// const megaMenuBack = document.querySelectorAll('.mobile-navbar__mega-menu-back');

// const handleClickOnLink = (e) => {
//     e.preventDefault();
//     const link = e.target;
//     const menu = link.nextElementSibling;
//     const isMenuOpen = menu.style.display === 'block';
//     if (!isMenuOpen) {
//         menu.style.display = 'block';
//         setTimeout(() => {
//             menu.classList.add('mobile-navbar__show-mega-menu');
//         }, 10);
//     }
// };

// const handleClickOnBack = (e) => {
//     const menu = e.target.parentNode.parentNode.parentNode;
//     menu.classList.remove('mobile-navbar__show-mega-menu');
//     setTimeout(() => {
//         menu.style.display = 'none';
//     }, 100);
// };

// linksDrawer.forEach((link) => {
//     link.addEventListener('click', handleClickOnLink);
// });

// megaMenuBack.forEach((back) => {
//     back.addEventListener('click', handleClickOnBack);
// });

document.addEventListener('DOMContentLoaded', () => {
    const mobileNavContainer = document.querySelector('.mobile-navbar__container');

    // Event delegation for both links and back buttons
    mobileNavContainer.addEventListener('click', (e) => {
        if (e.target.matches('.mobile-navbar__primary-inner-link')) {
            e.preventDefault();
            const menu = e.target.nextElementSibling;
            if (!menu) return;

            menu.style.display = 'block';
            setTimeout(() => {
                menu.classList.add('mobile-navbar__show-mega-menu');
            }, 10);
        }

        if (
            e.target.matches('.mobile-navbar__mega-menu-back') ||
            e.target.closest('.mobile-navbar__mega-menu-back').contains(e.target)
        ) {
            const menu = e.target.closest('.mobile-navbar__mega-menu-container');
            if (!menu) return;

            menu.classList.remove('mobile-navbar__show-mega-menu');
            setTimeout(() => {
                menu.style.display = 'none';
            }, 250);
        }
    });
});
