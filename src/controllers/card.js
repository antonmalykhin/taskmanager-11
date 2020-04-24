import CardComponent from '../components/card.js';
import CardEditComponent from '../components/edit-card.js';

import {render, replace, RenderPosition} from '../utils/render.js';

class CardController {
  constructor(container) {
    this._container = container;

    this._cardComponent = null;
    this._cardEditComponent = null;

    this._onEscKayDown = this._onEscKayDown.bind(this);
  }

  render(card) {
    this._cardComponent = new CardComponent(card);
    this._cardEditComponent = new CardEditComponent(card);

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKayDown);
    });

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToCard();
      document.removeEventListener(`keydown`, this._onEscKayDown);
    });

    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
  }

  _replaceCardToEdit() {
    replace(this._cardEditComponent, this._cardComponent);
  }

  _replaceEditToCard() {
    replace(this._cardComponent, this._cardEditComponent);
  }

  _onEscKayDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._replaceEditToCard();
      document.removeEventListener(`keydown`, this._onEscKayDown);
    }
  }
}

export default CardController;

