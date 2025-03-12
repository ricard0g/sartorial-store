if (!customElements.get('show-more-button')) {
    customElements.define(
        'show-more-button',
        class ShowMoreButton extends HTMLElement {
            constructor() {
                super();
                const button = this.querySelector('button');
                button.addEventListener('click', (e) => {
                    this.expandShowMore(e);
                    const nextElementToFocus = e.target.closest('.parent-display').querySelector('.show-more-item');
                    if (
                        nextElementToFocus &&
                        !nextElementToFocus.classList.contains('hidden') &&
                        nextElementToFocus.querySelector('input')
                    ) {
                        nextElementToFocus.querySelector('input').focus();
                    }
                });
            }

            expandShowMore(e) {
                const parentDisplay = e.target.closest('[id^="Show-More-"]').closest('.parent-display');
                const parentWrap = parentDisplay.querySelector('.parent-wrap');
                this.querySelectorAll('.label-text').forEach((el) => el.classList.toggle('hidden'));
                parentDisplay.querySelectorAll('.show-more-item').forEach((item) => item.classList.toggle('hidden'));
                if (!this.querySelector('.label-show-less')) {
                    this.classList.add('hidden');
                }
            }
        }
    );
}
