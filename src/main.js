import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import FilterController from './controllers/filter.js';
import StatisticsComponent from './components/statistics.js';

import CardsModel from './models/cards.js';

import {render, RenderPosition} from './utils/render.js';

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

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const statisticsComponent = new StatisticsComponent({cards: cardsModel, dateFrom, dateTo});
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createCard();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});
