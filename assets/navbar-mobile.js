import { searchManagerInstance } from './navbar.js';
let mobileNavManager;
let mobileNavStickyManager;

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
        // Only store essential top-level containers
        this.menuDrawer = document.querySelector('.mobile-navbar__container');
        this.backgroundNavbarMobile = document.querySelector('.mobile-navbar__container-background');

        this.init();
    }

    init() {
        // Single document-level event listener for all mobile navbar interactions
        document.addEventListener('click', (e) => this.handleMobileNavbarEvents(e));
    }

    handleMobileNavbarEvents(e) {
        const target = e.target;

        // Handle hamburger button clicks
        if (target.matches('#hamburger-btn-mobile') || target.closest('#hamburger-btn-mobile')) {
            this.handleHamburgerBtnClick(target.closest('#hamburger-btn-mobile'));
            return;
        }

        // Handle background clicks
        if (target.matches('.mobile-navbar__container-background')) {
            this.closeMenu();
            return;
        }

        // Handle mega menu link clicks
        if (target.matches('.mobile-navbar__primary-inner-link')) {
            this.handleMegaMenuLink(e);
            return;
        }

        // Handle mega menu back button clicks
        if (
            target.matches('.mobile-navbar__mega-menu-back') ||
            target.closest('.mobile-navbar__mega-menu-back')
        ) {
            this.handleMegaMenuBack(e);
            return;
        }
    }

    handleHamburgerBtnClick(hamburgerBtn) {
        const navbar = hamburgerBtn.closest('.subnavbar-wrapper');
        if (!navbar) return;

        // Get hamburger lines within this specific navbar
        const lines = {
            first: navbar.querySelector('#first-line-hamburguer'),
            second: navbar.querySelector('#second-line-hamburguer'),
            third: navbar.querySelector('#third-line-hamburguer')
        };

        // Toggle hamburger animation classes
        Object.values(lines).forEach((line, index) => {
            if (!line) return;
            line.classList.toggle(`${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}-line`);
        });

        // Toggle menu drawer
        if (this.menuDrawer) {
            const isVisible = this.menuDrawer.style.display === 'block';
            this.menuDrawer.style.display = isVisible ? 'none' : 'block';
            
            // Animate opacity after display change
            requestAnimationFrame(() => {
                this.menuDrawer.style.opacity = isVisible ? '0' : '1';
            });
        }
    }

    handleMegaMenuLink(e) {
        e.preventDefault();
        const menu = e.target.nextElementSibling;
        if (!menu) return;

        // Show mega menu with animation
        menu.style.display = 'block';
        requestAnimationFrame(() => {
            menu.classList.add('mobile-navbar__show-mega-menu');
        });
    }

    handleMegaMenuBack(e) {
        const menu = e.target.closest('.mobile-navbar__mega-menu-container');
        if (!menu) return;

        // Hide mega menu with animation
        menu.classList.remove('mobile-navbar__show-mega-menu');
        this.onTransitionEnd(menu, () => {
            menu.style.display = 'none';
        });
    }

    closeMenu() {
        // Find all hamburger lines in any navbar
        document.querySelectorAll('[id^="first-line"], [id^="second-line"], [id^="third-line"]')
            .forEach(line => {
                const className = line.id.includes('first') ? 'first' : 
                                line.id.includes('second') ? 'second' : 'third';
                line.classList.remove(`${className}-line`);
            });

        // Close menu drawer with animation
        if (this.menuDrawer) {
            this.menuDrawer.style.opacity = '0';
            this.onTransitionEnd(this.menuDrawer, () => {
                this.menuDrawer.style.display = 'none';
            });
        }
    }

    // Utility method for handling transitions
    onTransitionEnd(element, callback) {
        const handler = () => {
            element.removeEventListener('transitionend', handler);
            callback();
        };
        element.addEventListener('transitionend', handler);
    }
}

// class MobileNavManager {
//     constructor() {
//         this.mobileNavbar = document.querySelectorAll('#subnavbar-wrapper-sm').item(1);
//         this.hamburgerBtn = this.mobileNavbar.querySelector('#hamburger-btn-mobile');
//         this.firstLineHamburger = this.mobileNavbar.querySelector('#first-line-hamburguer');
//         this.secondLineHamburger = this.mobileNavbar.querySelector('#second-line-hamburguer');
//         this.thirdLineHamburger = this.mobileNavbar.querySelector('#third-line-hamburguer');
//         this.menuDrawer = document.querySelector('.mobile-navbar__container');
//         this.backgroundNavbarMobile = document.querySelector('.mobile-navbar__container-background');

//         console.log(this.mobileNavbar);
//         console.log(this.hamburgerBtn);
//         console.log(this.firstLineHamburger);
//         console.log(this.secondLineHamburger);
//         console.log(this.thirdLineHamburger);
//         console.log(this.menuDrawer);
//         console.log(this.backgroundNavbarMobile);

//         this.init();
//         this.initEventDelegation();
//     }

//     init() {
//         this.hamburgerBtn.addEventListener('click', () => this.handleHamburgerBtnClick());
//         this.backgroundNavbarMobile.addEventListener('click', () => this.closeMenu());
//     }

//     initEventDelegation() {
//         document.addEventListener('DOMContentLoaded', () => {
//             this.menuDrawer.addEventListener('click', (e) => this.handleMegaMenuEvents(e));
//         });
//     }

//     handleMegaMenuEvents(e) {
//         if (e.target.matches('.mobile-navbar__primary-inner-link')) {
//             this.handleMegaMenuLink(e);
//         }

//         if (
//             e.target.matches('.mobile-navbar__mega-menu-back') ||
//             e.target.closest('.mobile-navbar__mega-menu-back')?.contains(e.target)
//         ) {
//             this.handleMegaMenuBack(e);
//         }
//     }

//     handleMegaMenuLink(e) {
//         e.preventDefault();
//         const menu = e.target.nextElementSibling;
//         if (!menu) return;

//         menu.style.display = 'block';
//         setTimeout(() => {
//             menu.classList.add('mobile-navbar__show-mega-menu');
//         }, 10);
//     }

//     handleMegaMenuBack(e) {
//         const menu = e.target.closest('.mobile-navbar__mega-menu-container');
//         if (!menu) return;

//         menu.classList.remove('mobile-navbar__show-mega-menu');
//         setTimeout(() => {
//             menu.style.display = 'none';
//         }, 250);
//     }

//     handleHamburgerBtnClick = () => {
//         console.log('handleHamburgerBtnClick');
//         this.firstLineHamburger.classList.toggle('first-line');
//         this.secondLineHamburger.classList.toggle('second-line');
//         this.thirdLineHamburger.classList.toggle('third-line');
//         this.menuDrawer.style.display = this.menuDrawer.style.display === 'none' ? 'block' : 'none';
//         setTimeout(() => {
//             this.menuDrawer.style.opacity = this.menuDrawer.style.opacity === '0' ? '1' : '0';
//         }, 10);
//     };

//     // handleClickOnNavbarBg will also be used for closing menu on 'navbar.js'
//     closeMenu() {
//         this.firstLineHamburger.classList.remove('first-line');
//         this.secondLineHamburger.classList.remove('second-line');
//         this.thirdLineHamburger.classList.remove('third-line');
//         this.menuDrawer.style.display = 'none';
//         this.menuDrawer.style.opacity = '0';
//     }
// }

class MobileNavStickyManager {
    constructor() {
        if (window.innerWidth < 769) {
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
    }

    initialize() {
        const originalNavbar = document.getElementById('subnavbar-wrapper-sm');
        const header = document.querySelector('header');
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
mobileNavStickyManager = new MobileNavStickyManager();

// Since both navbar.js and navbar-mobile.js are loaded on the same page and as modules we want to prevent multiple instances of MobileNavManager
if (!window.mobileNavManagerInstance) {
    mobileNavManager = new MobileNavManager();
    window.mobileNavManagerInstance = mobileNavManager;
} else {
    mobileNavManager = window.mobileNavManagerInstance;
}

export { mobileNavManager };
