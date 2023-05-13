import Character from "../js/Character";

export default class Bowman extends Character {
    constructor(...args) {
        super(...args);
        this.attack = 25;
        this.defence = 25;
      }
}