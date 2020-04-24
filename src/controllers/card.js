import CardComponent from '../components/card.js';
import CardEditComponent from '../components/edit-card.js';

import {render, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

class CardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._cardComponent = null;
    this._cardEditComponent = null;

    this._onEscKayDown = this._onEscKayDown.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;

    this._cardComponent = new CardComponent(card);
    this._cardEditComponent = new CardEditComponent(card);

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKayDown);
    });

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToCard();
    });

    this._cardComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isArchive: !card.isArchive,
      }));
    });

    this._cardComponent.setEditButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    if (oldCardEditComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._cardEditComponent, oldCardEditComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  _replaceCardToEdit() {
    this._onViewChange();
    replace(this._cardEditComponent, this._cardComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._cardEditComponent.reset();
    replace(this._cardComponent, this._cardEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKayDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._replaceEditToCard();
      document.removeEventListener(`keydown`, this._onEscKayDown);
    }
  }
}

export default CardController;

