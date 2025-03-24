// Consolidate initialization into a single function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize product carousels
    if (!window.location.pathname.includes('/collections')) {
        var elem = document.querySelector('.product-slider__carousel');
        if (elem) {
            const smallScreen = window.innerWidth < 769;
            var flkty = new Flickity(elem, {
                freeScroll: true,
                contain: true,
                wrapAround: true,
                pageDots: false,
                draggable: smallScreen,
                prevNextButtons: !smallScreen,
            });
        }
    }
    
    // Set up modal functionality
    setupModalFunctionality();
    
    // Set up dialog animations
    setupDialogAnimation('.product-slider__modal');
});

// Modal functionality
function setupModalFunctionality() {
    const carousel = 
        document.querySelector('.product-slider__container') ||
        document.querySelector('.collection-product-grid__products-wrapper');
    
    if (!carousel) return;
    
    let dialogCarousels = {};
    
    carousel.addEventListener('click', (e) => {
        if (e.target.matches('[data-open-modal]')) {
            const dialog = e.target.nextElementSibling;
            
            // Show the modal (animation handled in setupDialogAnimation)
            dialog.showModal();
            
            // Initialize the carousel
            if (!dialogCarousels[dialog.id]) {
                const dialogCarousel = dialog.querySelector('.product-slider__carousel-dialog');
                if (dialogCarousel) {
                    dialogCarousels[dialog.id] = new Flickity(dialogCarousel, {
                        wrapAround: true,
                        cellAlign: 'center',
                        imagesLoaded: true,
                        pageDots: false,
                        draggable: false,
                    });
                }
            }
        }
        
        if (e.target.matches('[data-close-modal]') || e.target.closest('[data-close-modal]')) {
            const dialog = e.target.closest('dialog');
            if (dialog) dialog.close();
        }
    });
}

// Dialog animation setup - Safari compatible
function setupDialogAnimation(dialogSelector) {
    const dialogs = document.querySelectorAll(dialogSelector);
    
    dialogs.forEach((dialog) => {
        // Safari fix: close dialog when backdrop is clicked
        dialog.addEventListener('click', function(event) {
            if (event.target === dialog) {
                dialog.close();
            }
        });
        
        // Store original showModal function
        const originalShowModal = dialog.showModal;
        
        // Override showModal with our version
        dialog.showModal = function() {
            // Set initial state directly with inline styles for better browser compatibility
            this.style.opacity = '0';
            this.style.transform = 'translateY(20px)';
            
            // Call original function to open dialog
            originalShowModal.call(this);
            
            // Force browser layout calculation
            void this.offsetWidth;
            
            // Trigger animation after a short delay
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.transform = 'translateY(0)';
            }, 20);
        };
        
        // Store original close function
        const originalClose = dialog.close;
        
        // Handle closing animation
        dialog.close = function() {
            // Animate out
            this.style.opacity = '0';
            this.style.transform = 'translateY(20px)';
            
            // Wait for animation to complete before actually closing
            setTimeout(() => {
                originalClose.call(this);
                // Reset styles after closing
                this.style.opacity = '';
                this.style.transform = '';
            }, 300); // Match transition duration in CSS
        };
    });
}