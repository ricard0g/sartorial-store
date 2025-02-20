import { searchManagerInstance } from './navbar.js';

// Add this throttle function at the top of your file
const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

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

class MobileNavStickyManager {
    constructor() {
        if (window.mobileNavStickyManagerInstance) {
            return window.mobileNavStickyManagerInstance;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }

        window.mobileNavStickyManagerInstance = this;
    }

    initialize() {
        const originalNavbar = document.getElementById('subnavbar-wrapper-sm');
        const header = document.querySelector('header');
        console.log(originalNavbar);
        console.log('', originalNavbar.parentNode.parentNode);
        this.navbar = originalNavbar.cloneNode(true);
        this.navbar.style.display = 'none';
        this.navbar.style.transform = 'translateY(-100%)';

        document.body.insertBefore(this.navbar, header);

        this.desktopNavbarDimensions = document.querySelector('.main-navbar-wrapper');
        this.animationFrame = null;
        this.isVisible = false;

        this.initializeScrollListener();
    }

    initializeScrollListener() {
        window.addEventListener(
            'scroll',
            throttle(() => {
                this.handleScroll();
            }, 50)
        );
    }

    handleScroll() {
        const mainNavbarBottom = this.desktopNavbarDimensions.getBoundingClientRect().bottom + window.scrollY + 400;

        if (mainNavbarBottom < window.scrollY) {
            if (!this.isVisible) {
                this.showTabletNavbar();
            }
        } else {
            this.hideTabletNavbar();
        }
    }

    showTabletNavbar() {
        this.navbar.style.display = 'block';
        this.navbar.style.position = 'sticky';
        this.navbar.style.top = '0';
        this.startAnimation();
        searchManagerInstance.closeAllSearchDropdowns();
    }

    hideTabletNavbar() {
        this.navbar.style.display = 'none';
        this.navbar.style.transform = 'translateY(-100%)';
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.isVisible = false;
    }

    startAnimation(startTime = null) {
        if (!startTime) {
            this.animationFrame = requestAnimationFrame((timestamp) => this.startAnimation(timestamp));
        }

        const progress = Math.min((performance.now() - startTime) * 0.6, 100);
        this.navbar.style.transform = `translateY(-${100 - progress}%)`;
        if (progress < 100) {
            this.animationFrame = requestAnimationFrame(() => this.startAnimation(startTime));
        } else {
            this.isVisible = true;
            this.animationFrame = null;
        }
    }
}

let mobileNavStickyManager;
if (!window.mobileNavStickyManagerInstance) {
    mobileNavStickyManager = new MobileNavStickyManager();
} else {
    mobileNavStickyManager = window.mobileNavStickyManagerInstance;
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
