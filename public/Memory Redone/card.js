class MCard extends HTMLElement {

    set cardId(id) {
        this._id = id;
    }

    get cardId() {
        return this._id;
    }

    set source(source) {
        this._source = source;
        if (this.img) this.img.src = source;
    }

    get source() {
        return this._source;
    }

    createdCallback() {
        this.shadow = this.createShadowRoot();
        console.log(this.transform);
        debugger;
    }

    attachedCallback() {
        this.img = document.createElement('img');
        this.img.src = this.source;
        this.img.height = this.height;
        this.img.width = this.width;
        console.log(this.height);
        this.shadow.appendChild(this.img);
        this.addEventListener('click', _ => {
            const event = new CustomEvent('flip', {
                bubbles: true
            });
            this.dispatchEvent(event);
        });
    }

    detachedCallback() {

    }

    attributeChangedCallback() {

    }
}

document.registerElement('memory-card', MCard);