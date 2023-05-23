import emoji from "./emoji";
/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
 export default class Character {
    constructor(level, type = 'generic') {
      if (!new.target) {
        throw new Error ("Character() must be called with new")
      };
      this.level = level;
      this.attack = null;
      this.defence = null;
      this.health = null;
      this.type = type;
      this.maxHealth = null;
      this.moveRadius = null;
      this.attackRadius = null;
    }

    get message() {
      const level = `${emoji.medal} ${this.level} `;
      const attack = `${emoji.swords} ${this.attack} `;
      const defence = `${emoji.shield} ${this.defence} `;
      const health = `${emoji.heart} ${this.health}`;
      return level + attack + defence + health;
    }

    levelUp() {
      this.level += 1;
      this.attack = Math.round(Math.max(this.attack, this.attack * ((80 + this.health) / 100)));
  
      if (this.health < 0) {
        this.health = 0
      }
      this.maxHealth = (this.health < 20) ? this.health + 80 : 100;
    }
  
    restoreHealth() {
      this.health = this.maxHealth;
    }
  
    isLiving() {
      return (this.health > 0);
    }
  }