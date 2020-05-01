import {COLORS} from '../const.js';
import {getRandomArrayItem, getRandomDate} from '../utils/common.js';

const DefaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};


const DescriptionItems = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {
    "mo": Math.random() > 0.5,
  });
};

const generateCard = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    id: String(new Date() + Math.random()),
    description: getRandomArrayItem(DescriptionItems),
    dueDate,
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),
    color: getRandomArrayItem(COLORS),
    isFavorite: Math.random() > 0.5,
    isArchive: Math.random() > 0.5
  };
};

const generateCards = (count) => {
  return new Array(count).fill(``).map(generateCard);
};

export {generateCard, generateCards};

