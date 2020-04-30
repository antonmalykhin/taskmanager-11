import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
// import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import FilterController from './controllers/filter.js';

import CardsModel from './models/cards.js';

import {render, RenderPosition} from './utils/render.js';

// import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/card.js';


const CARD_COUNT = 40;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();
render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const cards = generateCards(CARD_COUNT);
const cardsModel = new CardsModel();
cardsModel.setCards(cards);

const filterController = new FilterController(siteMainElement, cardsModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, cardsModel);
boardController.render();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createCard();
      break;
  }
});
