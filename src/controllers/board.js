import CardsComponent from '../components/cards.js';
import CardController, {Mode as CardControllerMode, EmptyCard} from './card.js';
import NoCardsComponent from '../components/no-cards.js';
import SortingComponent, {SortingType} from '../components/sorting.js';
import LoadMoreButtonComponent from '../components/load-more-btn.js';

import {render, remove, RenderPosition} from '../utils/render.js';

const SHOWING_CARDS_COUNT_ON_START = 8;
const SHOWING_CARDS_COUNT_BY_BUTTON = 8;

const renderCards = (cardListElement, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const cardController = new CardController(cardListElement, onDataChange, onViewChange);

    cardController.render(card, CardControllerMode.DEFAULT);

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
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._showedCardControllers = [];
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    this._noCardsComponent = new NoCardsComponent();
    this._sortingComponent = new SortingComponent();
    this._cardsComponent = new CardsComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._creatingCard = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortingTypeChange = this._onSortingTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._sortingComponent.setSortingTypeChangeHandler(this._onSortingTypeChange);
    this._cardsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const cards = this._cardsModel.getCards();
    const isAllCardsArchived = cards.every((card) => card.isArchive);
    const container = this._container.getElement();

    if (isAllCardsArchived) {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._cardsComponent, RenderPosition.BEFOREEND);

    this._renderCards(cards.slice(0, this._showingCardsCount));

    this._renderLoadMoreButton();
  }

  createCard() {
    if (this._creatingCard) {
      return;
    }

    const cardListElement = this._cardsComponent.getElement();
    this._creatingCard = new CardController(cardListElement, this._onDataChange, this._onViewChange);
    this._creatingCard.render(EmptyCard, CardControllerMode.ADDING);
  }


  _removeCards() {
    this._showedCardControllers.forEach((cardController) => cardController.destroy());
    this._showedCardControllers = [];
  }

  _renderCards(cards) {
    const cardListElement = this._cardsComponent.getElement();

    const newCards = renderCards(cardListElement, cards, this._onDataChange, this._onViewChange);

    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardsCount = this._showedCardControllers.length;
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingCardsCount >= this._cardsModel.getCards().length) {
      return;
    }

    render(this._container.getElement(), this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);

  }

  _onLoadMoreButtonClick() {
    const prevCardsCount = this._showingCardsCount;
    const cards = this._cardsModel.getCards();

    this._showingCardsCount = this._showingCardsCount + SHOWING_CARDS_COUNT_BY_BUTTON;

    const sortedCards = getSortedCards(cards, this._sortingComponent.getSortingType(), prevCardsCount, this._showingCardsCount);

    this._renderCards(sortedCards);

    if (this._showingCardsCount >= cards.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _updateCards(count) {
    this._removeCards();
    this._renderCards(this._cardsModel.getCards().slice(0, count));
    this._renderLoadMoreButton();
  }

  _onSortingTypeChange(sortingType) {
    this._showingCardsCount = SHOWING_CARDS_COUNT_BY_BUTTON;

    const sortedCards = getSortedCards(this._cardsModel.getCards(), sortingType, 0, this._showingCardsCount);

    this._removeCards();
    this._renderCards(sortedCards);
    this._renderLoadMoreButton();
  }

  _onDataChange(cardController, oldData, newData) {
    if (oldData === EmptyCard) {
      this._creatingCard = null;
      if (newData === null) {
        cardController.destroy();
        this._updateCards(this._showingCardsCount);
      } else {
        this._cardsModel.addCard(newData);
        cardController.render(newData, CardControllerMode.DEFAULT);

        if (this._showingCardsCount % SHOWING_CARDS_COUNT_BY_BUTTON === 0) {
          const destroyedCard = this._showedCardControllers.pop();
          destroyedCard.destroy();
        }

        this._showedCardControllers = [].concat(cardController, this._showedCardControllers);
        this._showingCardsCount = this._showedCardControllers.length;

        this._renderLoadMoreButton();
      }
    } else if (newData === null) {
      this._cardsModel.removeCard(oldData.id);
      this._updateCards(this._showingCardsCount);
    } else {
      const isSuccess = this._cardsModel.updateCard(oldData.id, newData);

      if (isSuccess) {
        cardController.render(newData, CardControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateCards(SHOWING_CARDS_COUNT_ON_START);
  }

  show() {
    this._onSortingTypeChange(SortingType.DEFAULT);
    this._container.show();
  }

  hide() {
    this._container.hide();
  }
}

export default BoardController;
