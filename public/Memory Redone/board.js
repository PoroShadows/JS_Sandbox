class MBoard extends HTMLElement {

    get cards() {
        return this._cards.length != 0 ? this._cards : this._cards = this.querySelectorAll('memory-card');
    }

    createdCallback() {
        this.cardAmount = 20;
        this.cardsFlippedAmount = 0;
        this._cards = [];
    }

    attachedCallback() {
        this.generateCards();
        this.addEventListener('flip', evt => {
            let card = evt.target, srcWas = card.source;
            card.source = this.cardsFlippedAmount < 2 ? card.source.includes('back') ? `../cards/card${card.id%(this.cardAmount/2)}.jpg` : '../cards/cardback.jpg' : '../cards/cardback.jpg';
            this.cardsFlippedAmount += card.source.includes('back') ? srcWas.includes('back') ? 0 : -1 : 1;
        });
    }

    detachedCallback() {

    }

    attributeChangedCallback() {

    }

    generateCards() {
        for (let i = 0; i < this.cardAmount; i++) {
            /** @type {MCard} */
            let card = document.createElement('memory-card');
            card.cardId = i;
            card.source = `../cards/cardback.jpg`;
            this.appendChild(card);
        }
    }
}

document.registerElement('memory-board', MBoard);