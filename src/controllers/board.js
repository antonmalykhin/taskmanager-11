import CardsComponent from '../components/cards.js';
import CardComponent from '../components/card.js';
import CardEditComponent from '../components/edit-card.js';
import NoCardsComponent from '../components/no-cards.js';
import SortingComponent from '../components/sorting.js';
import LoadButtonComponent from '../components/load-more-btn.js';

import {render, replace, remove, RenderPosition} from '../utils/render.js';

const SHOWING_CARDS_COUNT_ON_START = 8;
const SHOWING_CARDS_COUNT_BY_BUTTON = 8;

const renderCard = (cardListElement, card) => {
  const replaceCardToEdit = () => {
    replace(cardEditComponent, cardComponent);
  };

  const replaceEditToCard = () => {
    replace(cardComponent, cardEditComponent);
  };

  const onEscKayDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replaceEditToCard();
      document.removeEventListener(`keydown`, onEscKayDown);
    }
  };

  const cardComponent = new CardComponent(card);
  const cardEditComponent = new CardEditComponent(card);

  cardComponent.setEditButtonClickHandler(() => {
    replaceCardToEdit();
    document.addEventListener(`keydown`, onEscKayDown);
  });

  cardEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToCard();
    document.removeEventListener(`keydown`, onEscKayDown);
  });

  render(cardListElement, cardComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, cards) => {
  const isAllCardsArchived = cards.every((card) => card.isArchive);

  if (isAllCardsArchived) {
    render(boardComponent.getElement(), new NoCardsComponent(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortingComponent(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new CardsComponent(), RenderPosition.BEFOREEND);

  const cardListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

  cards.slice(0, showingCardsCount).forEach((card) => {
    renderCard(cardListElement, card);
  });

  const loadMoreButtonComponent = new LoadButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent, RenderPosition.BEFOREEND);

  loadMoreButtonComponent.setClickHandler(() => {
    const prevCardCount = showingCardsCount;
    showingCardsCount = showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

    cards.slice(prevCardCount, showingCardsCount).forEach((card) => render(cardListElement, renderCard(cardListElement, card)));

    if (showingCardsCount >= cards.length) {
      remove(loadMoreButtonComponent);
    }
  });
};

class BoardController {
  constructor(container) {
    this._container = container;
  }

  render(cards) {
    renderBoard(this._container, cards);
  }
}

export default BoardController;
