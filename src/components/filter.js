import AbstractComponent from './abstract-component.js';

const createFilterItem = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
    />
    <label for="filter__${name}"    class="filter__label">
    ${name} <span class="filter__${name}-count">${count}</span></label
    `
  );
};

const createFilterTemplate = (filters) => {
  const filterItems = filters.map((it, i) => createFilterItem(it, i === 0)).join(`\n`);

  return (
    `<section class="main__filter filter container">
    ${filterItems}
    </section>`
  );
};

class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}

export default Filter;
