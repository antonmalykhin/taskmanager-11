import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createSortingTemplate} from './components/sorting.js';
import {createEditCardTemplate} from './components/edit-card.js';
import {createCardTemplate} from './components/card.js';
import {createLoadButtonTemplate} from './components/load-more-btn';
import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/card.js';

const CARD_COUNT = 22;
const SHOWING_CARDS_COUNT_ON_START = 8;
const SHOWING_CARDS_COUNT_BY_BUTTON = 8;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate());

const filters = generateFilters();
const cards = generateCards(CARD_COUNT);

render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render(boardElement, createSortingTemplate(), `afterbegin`);
render(taskListElement, createEditCardTemplate(cards[0]));

let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

cards.slice(1, showingCardsCount)
  .forEach((card) => render(taskListElement, createCardTemplate(card)));

render(boardElement, createLoadButtonTemplate());

const loadMoreButton = boardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevCardCount = showingCardsCount;
  showingCardsCount = showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

  cards.slice(prevCardCount, showingCardsCount)
    .forEach((card) => render(taskListElement, createCardTemplate(card)));

  if (showingCardsCount >= cards.length) {
    loadMoreButton.remove();
  }
});
