import Character from "../js/Character";

export default class Magician extends Character {
    constructor(level) {
        super(level, 'magician');
        this.attack = 10;
        this.defence = 40;
        this.health = 100;
        this.maxHelth = 100;
        this.moveRadius = 1;
        this.attackRadius = 4
      }
}