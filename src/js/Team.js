import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

const character = [new Swordsman(), new Bowman(), new Magician(), new Daemon(), new Undead(), new Vampire()]

/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
 export default class Team {
  constructor() {
    this.members = new Set();
  }
  add(character) {
    this.members.add(character);
  }
  addAll(...characters) {
    characters.forEach((character) => {
      this.members.add(character);
    });
  }
  toArray() {
    return Array.from(this.members);
  }
    // TODO: write your logic here
  }

  //const team = new Team()