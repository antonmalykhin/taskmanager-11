import AbstractComponent from './abstract-component.js';

const createNoCardsTemplate = () => {
  return `<p class="board__no-tasks">Click «ADD NEW TASK» in menu to create your first task</p>`;
};

class NoCards extends AbstractComponent {
  getTemplate() {
    return createNoCardsTemplate();
  }
}

export default NoCards;
