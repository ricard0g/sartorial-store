class MobileNavManager {
    constructor() {
        this.hamburgerBtn = document.getElementById('hamburger-btn-mobile');
        this.firstLineHamburger = document.getElementById('first-line-hamburguer');
        this.secondLineHamburger = document.getElementById('second-line-hamburguer');
        this.thirdLineHamburger = document.getElementById('third-line-hamburguer');
        this.menuDrawer = document.querySelector('.mobile-navbar__container');
        this.backgroundNavbarMobile = document.querySelector('.mobile-navbar__container-background');

        this.init();
        this.initEventDelegation();
    }

    init() {
        this.hamburgerBtn.addEventListener('click', () => this.handleHamburgerBtnClick());
        this.backgroundNavbarMobile.addEventListener('click', () => this.closeMenu());
    }

    initEventDelegation() {
        document.addEventListener('DOMContentLoaded', () => {
            this.menuDrawer.addEventListener('click', (e) => this.handleMegaMenuEvents(e));
        });
    }

    handleMegaMenuEvents(e) {
        if (e.target.matches('.mobile-navbar__primary-inner-link')) {
            this.handleMegaMenuLink(e);
        }

        if (
            e.target.matches('.mobile-navbar__mega-menu-back') ||
            e.target.closest('.mobile-navbar__mega-menu-back')?.contains(e.target)
        ) {
            this.handleMegaMenuBack(e);
        }
    }

    handleMegaMenuLink(e) {
        e.preventDefault();
        const menu = e.target.nextElementSibling;
        if (!menu) return;

        menu.style.display = 'block';
        setTimeout(() => {
            menu.classList.add('mobile-navbar__show-mega-menu');
        }, 10);
    }

    handleMegaMenuBack(e) {
        const menu = e.target.closest('.mobile-navbar__mega-menu-container');
        if (!menu) return;

        menu.classList.remove('mobile-navbar__show-mega-menu');
        setTimeout(() => {
            menu.style.display = 'none';
        }, 250);
    }

    handleHamburgerBtnClick = () => {
        this.firstLineHamburger.classList.toggle('first-line');
        this.secondLineHamburger.classList.toggle('second-line');
        this.thirdLineHamburger.classList.toggle('third-line');
        this.menuDrawer.style.display = this.menuDrawer.style.display === 'none' ? 'block' : 'none';
        setTimeout(() => {
            this.menuDrawer.style.opacity = this.menuDrawer.style.opacity === '0' ? '1' : '0';
        }, 10);
    };

    // handleClickOnNavbarBg will also be used for closing menu on 'navbar.js'
    closeMenu() {
        this.firstLineHamburger.classList.remove('first-line');
        this.secondLineHamburger.classList.remove('second-line');
        this.thirdLineHamburger.classList.remove('third-line');
        this.menuDrawer.style.display = 'none';
        this.menuDrawer.style.opacity = '0';
    }
}

// Since both navbar.js and navbar-mobile.js are loaded on the same page and as modules we want to prevent multiple instances of MobileNavManager
let mobileNavManager;
if (!window.mobileNavManagerInstance) {
    mobileNavManager = new MobileNavManager();
    window.mobileNavManagerInstance = mobileNavManager;
} else {
    mobileNavManager = window.mobileNavManagerInstance;
}

export { mobileNavManager };
