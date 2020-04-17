import AbstractComponent from './abstract-component.js';

const createCardsTemplate = () => {
  return `<div class="board__tasks"></div>`;
};

class Cards extends AbstractComponent {
  getTemplate() {
    return createCardsTemplate();
  }
}

export default Cards;
