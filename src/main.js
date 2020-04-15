import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import SortingComponent from './components/sorting.js';
import CardEditComponent from './components/edit-card.js';
import CardComponent from './components/card.js';
import CardsComponent from './components/cards.js';
import LoadButtonComponent from './components/load-more-btn.js';
import NoCardsComponent from './components/no-cards.js';
import {render, RenderPosition} from './utils.js';
import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/card.js';

const CARD_COUNT = 25;
const SHOWING_CARDS_COUNT_ON_START = 8;
const SHOWING_CARDS_COUNT_BY_BUTTON = 8;

const renderCard = (cardListElement, card) => {

  const replaceCardToEdit = () => {
    cardListElement.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
  };

  const replaceEditToCard = () => {
    cardListElement.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
  };

  const onEscKayDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replaceEditToCard();
      document.removeEventListener(`keydown`, onEscKayDown);
    }
  };

  const cardComponent = new CardComponent(card);
  const editButton = cardComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    replaceCardToEdit();
    document.addEventListener(`keydown`, onEscKayDown);
  });

  const cardEditComponent = new CardEditComponent(card);
  const editForm = cardEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToCard();
    document.removeEventListener(`keydown`, onEscKayDown);
  });

  render(cardListElement, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, cards) => {
  const isAllCardsArchived = cards.every((card) => card.isArchive);

  if (isAllCardsArchived) {
    render(boardComponent.getElement(), new NoCardsComponent().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortingComponent().getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new CardsComponent().getElement(), RenderPosition.BEFOREEND);

  const cardListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

  cards.slice(0, showingCardsCount).forEach((card) => {
    renderCard(cardListElement, card);
  });

  const loadMoreButtonComponent = new LoadButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevCardCount = showingCardsCount;
    showingCardsCount = showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

    cards.slice(prevCardCount, showingCardsCount).forEach((card) => render(cardListElement, renderCard(cardListElement, card)));

    if (showingCardsCount >= cards.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const filters = generateFilters();
const cards = generateCards(CARD_COUNT);

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
renderBoard(boardComponent, cards);
