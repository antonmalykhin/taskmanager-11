import CardComponent from '../components/card.js';
import CardEditComponent from '../components/edit-card.js';

import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {Color} from "../const.js";

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const EmptyCard = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: Color.BLACK,
  isFavorite: false,
  isArchive: false,
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

  render(card, mode) {
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;
    this._mode = mode;

    this._cardComponent = new CardComponent(card);
    this._cardEditComponent = new CardEditComponent(card);

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKayDown);
    });

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._cardEditComponent.getData();
      this._onDataChange(this, card, data);
    });
    this._cardEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, card, null));

    this._cardComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isArchive: !card.isArchive,
      }));
    });

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldCardEditComponent && oldCardComponent) {
          replace(this._cardComponent, oldCardComponent);
          replace(this._cardEditComponent, oldCardEditComponent);
          this._replaceEditToCard();
        } else {
          render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldCardEditComponent && oldCardComponent) {
          remove(oldCardComponent);
          remove(oldCardEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._cardEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  destroy() {
    remove(this._cardEditComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceCardToEdit() {
    this._onViewChange();
    replace(this._cardEditComponent, this._cardComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._cardEditComponent.reset();

    if (document.contains(this._cardEditComponent.getElement())) {
      replace(this._cardComponent, this._cardEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKayDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyCard, null);
      }
      this._replaceEditToCard();
      document.removeEventListener(`keydown`, this._onEscKayDown);
    }
  }
}

export default CardController;
export {Mode, EmptyCard};

