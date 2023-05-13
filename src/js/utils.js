/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
 export function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left'
  } if (index > 0 && index <= 6) {
    return 'top'
  }  if (index === 7) {
    return 'top-right'
  } if (index === 8 || index === 16 || index === 24 || index === 32 || index === 40 || index === 48) {
    return 'left'
  } if (index === 15 || index === 23 || index === 31 || index === 39 || index === 47 || index === 55) {
    return 'right'
  } if (index === 56) {
    return 'bottom-left'
  } if (index > 56 && index <= 62) {
    return 'bottom'
  } if (index === 63) {
    return 'bottom-right'
  }
    //if (index === 0)
    // TODO: ваш код будет тут
    return 'center';
  }
  
  export function calcHealthLevel(health) {
    if (health < 15) {
      return 'critical';
    }
  
    if (health < 50) {
      return 'normal';
    }
  
    return 'high';
  }