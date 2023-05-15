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

  export function shuffle(arr) {
    let j;
    let temp;
  
    for (let i = arr.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
  
    return arr;
  }
  
  export function calcActionPositions(position, radius, boardSize) {
    const board = [];
    for (let i = 0; i < boardSize; i += 1) {
      board[i] = [];
      for (let j = 0; j < boardSize; j += 1) {
        board[i][j] = i * boardSize + j;
      }
    }
  
    const I = (position < boardSize) ? 0 : Math.floor(position / boardSize);
    const J = (position < boardSize) ? position : position % boardSize;
  
    const actionPositions = [];
    for (let R = 1; R <= radius; R += 1) {
      if ((I - R >= 0) && (J - R >= 0)) actionPositions.push(board[I - R][J - R]); // top-left
      if (I - R >= 0) actionPositions.push(board[I - R][J]); // top
      if ((I - R >= 0) && (J + R < boardSize)) actionPositions.push(board[I - R][J + R]); // top-right
      if (J - R >= 0) actionPositions.push(board[I][J - R]); // left
      if (J + R < boardSize) actionPositions.push(board[I][J + R]); // right
      if ((I + R < boardSize) && (J - R >= 0)) actionPositions.push(board[I + R][J - R]); // bottom-left
      if (I + R < boardSize) actionPositions.push(board[I + R][J]); // bottom
      if ((I + R < boardSize) && (J + R < boardSize)) actionPositions.push(board[I + R][J + R]); // bottom-right
    }
  
    return actionPositions;
  }
  
  export function randomItem(arr) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1));
    return arr[randomIndex];
  }