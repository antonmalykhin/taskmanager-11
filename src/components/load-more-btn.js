import {createElement} from '../utils.js';

const createLoadButtonTemplate = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

class LoadButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadButtonTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default LoadButton;
