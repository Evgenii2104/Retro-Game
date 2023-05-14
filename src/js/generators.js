import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
//const playerTypes = [Bowman, Swordsman, Magician];
//const compTypes = [Daemon, Undead, Vampire]
 export function* characterGenerator(allowedTypes, maxLevel) {
    while (true) {
      const RandomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
      const randomLevel = Math.round(Math.random() * (maxLevel - 1) + 1);
      yield new RandomType(randomLevel);
    }
  }
  
  /**
   * Формирует массив персонажей на основе characterGenerator
   * @param allowedTypes массив классов
   * @param maxLevel максимальный возможный уровень персонажа
   * @param characterCount количество персонажей, которое нужно сформировать
   * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
   * */
  export function generateTeam(allowedTypes, maxLevel, characterCount) {
    const generator = characterGenerator(allowedTypes, maxLevel);
    const team = [];
    for (let i = 0; i < characterCount; i += 1) {
      team.push(generator.next().value);
    }
    return team;
  }