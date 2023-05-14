import Character from "../js/Character";

export default class Swordsman extends Character {
    constructor(level) {
        super(level, 'swordsman');
        this.attack = 40;
        this.defence = 10;
        this.health = 100;
        this.maxHelth = 100;
        this.moveRadius = 4;
        this.attackRadius = 1
      }
}
