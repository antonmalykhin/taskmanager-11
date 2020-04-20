import AbstractComponent from './abstract-component.js';

const SortingType = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`
};

const createSortingTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter" data-sort-type="${SortingType.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sort-type="${SortingType.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sort-type="${SortingType.DATE_DOWN}">SORT BY DATE down</a>
    </div>`
  );
};

class Sorting extends AbstractComponent {
  constructor() {
    super();

    this._currentSortingType = SortingType.DEFAULT;
  }

  getTemplate() {
    return createSortingTemplate();
  }

  getSortingType() {
    return this._currentSortingType;
  }

  setSortingTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortingType = evt.target.dataset.sortType;

      if (this._currentSortingType === sortingType) {
        return;
      }

      this._currentSortingType = sortingType;

      handler(this._currentSortingType);
    });

  }
}

export default Sorting;
export {SortingType};
