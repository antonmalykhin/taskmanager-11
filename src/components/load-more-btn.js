import AbstractComponent from './abstract-component.js';

const createLoadButtonTemplate = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

class LoadButton extends AbstractComponent {
  getTemplate() {
    return createLoadButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}

export default LoadButton;
