/*import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import Character from './Character';*/
import PositionedCharacter from './PositionedCharacter';
import { shuffle } from './utils';
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

  export function generatePositions(boardSize, side, count) {
    if (side !== 'left' && side !== 'right') {
      throw new Error('Side must be <left> or <right>');
    }
  
    const allowedPositions = [];
    const n = boardSize ** 2;
    let i = (side === 'left') ? 0 : boardSize - 2;
  
    for (i; i < n; i += boardSize) {
      allowedPositions.push(i);
      allowedPositions.push(i + 1);
    }
  
    return shuffle(allowedPositions).slice(0, count);
  }
  
  export function generatePositionedCharacters(team1, team2, boardSize) {
    const positions1 = generatePositions(boardSize, 'left', team1.charactersCount);
    const positionedCharacters1 = team1.characters.map((character, i) => {
      const result = new PositionedCharacter(character, positions1[i], team1.player);
      return result;
    });
  
    const positions2 = generatePositions(boardSize, 'right', team2.charactersCount);
    const positionedCharacters2 = team2.characters.map((character, i) => {
      const result = new PositionedCharacter(character, positions2[i], team2.player);
      return result;
    });
  
    return positionedCharacters1.concat(positionedCharacters2);
  }