import CardsComponent from '../components/cards.js';
import CardController from './card.js';
import NoCardsComponent from '../components/no-cards.js';
import SortingComponent, {SortingType} from '../components/sorting.js';
import LoadButtonComponent from '../components/load-more-btn.js';

import {render, remove, RenderPosition} from '../utils/render.js';

const SHOWING_CARDS_COUNT_ON_START = 8;
const SHOWING_CARDS_COUNT_BY_BUTTON = 8;

const renderCards = (cardListElement, cards) => {
  cards.forEach((task) => {
    renderCard(cardListElement, task);
  });
};

const getSortedCards = (cards, sortingType, from, to) => {
  let sortedCards = [];
  const showingCards = cards.slice();

  switch (sortingType) {
    case SortingType.DATE_UP:
      sortedCards = showingCards.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortingType.DATE_DOWN:
      sortedCards = showingCards.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortingType.DEFAULT:
      sortedCards = showingCards;
      break;
  }

  return sortedCards.slice(from, to);
};

class BoardController {
  constructor(container) {
    this._container = container;

    this._noCardsComponent = new NoCardsComponent();
    this._sortingComponent = new SortingComponent();
    this._cardsComponent = new CardsComponent();
    this._loadMoreButtonComponent = new LoadButtonComponent();
  }

  render(cards) {
    const renderLoadMoreButton = () => {
      if (showingCardsCount >= cards.length) {
        return;
      }

      render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevCardsCount = showingCardsCount;
        showingCardsCount = showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

        const sortedCards = getSortedCards(cards, this._sortingComponent.getSortingType(), prevCardsCount, showingCardsCount);

        renderCards(cardListElement, sortedCards);

        if (showingCardsCount >= cards.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };

    const isAllCardsArchived = cards.every((card) => card.isArchive);
    const container = this._container.getElement();

    if (isAllCardsArchived) {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._cardsComponent, RenderPosition.BEFOREEND);

    const cardListElement = this._cardsComponent.getElement();

    let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    renderCards(cardListElement, cards.slice(0, showingCardsCount));
    renderLoadMoreButton();

    this._sortingComponent.setSortingTypeChangeHandler((sortingType) => {
      showingCardsCount = SHOWING_CARDS_COUNT_BY_BUTTON;

      const sortedCards = getSortedCards(cards, sortingType, 0, showingCardsCount);

      cardListElement.innerHTML = ``;

      renderCards(cardListElement, sortedCards);
      renderLoadMoreButton();
    });
  }
}

export default BoardController;
