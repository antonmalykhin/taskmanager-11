import CardsComponent from '../components/cards.js';
import CardController from './card.js';
import NoCardsComponent from '../components/no-cards.js';
import SortingComponent, {SortingType} from '../components/sorting.js';
import LoadButtonComponent from '../components/load-more-btn.js';

import {render, remove, RenderPosition} from '../utils/render.js';

const SHOWING_CARDS_COUNT_ON_START = 8;
const SHOWING_CARDS_COUNT_BY_BUTTON = 8;

const renderCards = (cardListElement, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const cardController = new CardController(cardListElement, onDataChange, onViewChange);

    cardController.render(card);

    return cardController;
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

    this._cards = [];
    this._showedCardControllers = [];
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    this._noCardsComponent = new NoCardsComponent();
    this._sortingComponent = new SortingComponent();
    this._cardsComponent = new CardsComponent();
    this._loadMoreButtonComponent = new LoadButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortingTypeChange = this._onSortingTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortingComponent.setSortingTypeChangeHandler(this._onSortingTypeChange);
  }

  render(cards) {
    this._cards = cards;

    const isAllCardsArchived = this._cards.every((card) => card.isArchive);
    const container = this._container.getElement();

    if (isAllCardsArchived) {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._cardsComponent, RenderPosition.BEFOREEND);

    const cardListElement = this._cardsComponent.getElement();

    const newCards = renderCards(cardListElement, cards.slice(0, this._showingCardsCount), this._onDataChange, this._onViewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showingCardsCount >= this._cards.length) {
      return;
    }

    render(this._container.getElement(), this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevCardsCount = this._showingCardsCount;
      const cardListElement = this._cardsComponent.getElement();
      this._showingCardsCount = this._showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

      const sortedCards = getSortedCards(this._cards, this._sortingComponent.getSortingType(), prevCardsCount, this._showingCardsCount);
      const newCards = renderCards(cardListElement, sortedCards, this._onDataChange, this._onViewChange);

      this._showedCardControllers = this._showedCardControllers.concat(newCards);

      if (this._showingCardsCount >= this._cards.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onSortingTypeChange(sortingType) {
    this._showingCardsCount = SHOWING_CARDS_COUNT_BY_BUTTON;

    const sortedCards = getSortedCards(this._cards, sortingType, 0, this._showingCardsCount);
    const cardListElement = this._cardsComponent.getElement();

    cardListElement.innerHTML = ``;

    const newCards = renderCards(cardListElement, sortedCards, this._onDataChange, this._onViewChange);
    this._showedCardControllers = newCards;

    this._renderLoadMoreButton();
  }

  _onDataChange(cardController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    cardController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }
}

export default BoardController;
