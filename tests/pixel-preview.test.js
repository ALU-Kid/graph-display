const { messageToPixels } = require('../utils/pixel-preview');
const test = require('node:test');
const assert = require('node:assert/strict');

test('messageToPixels returns 52x7 grid', () => {
  const grid = messageToPixels('A');
  assert.strictEqual(grid.length, 52, 'width should be 52 weeks');
  for (const column of grid) {
    assert.strictEqual(column.length, 7, 'each week should contain 7 days');
  }
});

// expected pixel map for 'A' as defined in utils/pixel-preview.js
const A_MAP = [
  [0, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [1, 0, 1],
  [1, 0, 1],
];

// intensity used by messageToPixels for "on" pixels
const ON = 4;

// verify first character columns match the defined font map
// and that subsequent columns remain zero

test('messageToPixels intensity values match font pattern', () => {
  const grid = messageToPixels('A');
  // verify A pattern
  for (let x = 0; x < A_MAP[0].length; x++) {
    for (let y = 0; y < A_MAP.length; y++) {
      const expected = A_MAP[y][x] ? ON : 0;
      assert.strictEqual(grid[x][y], expected, `cell (${x},${y})`);
    }
    // remaining rows beyond pattern height should be zero
    for (let y = A_MAP.length; y < 7; y++) {
      assert.strictEqual(grid[x][y], 0, `cell (${x},${y}) beyond height`);
    }
  }

  // charSpacing column after the character should be all zeros
  const spacingCol = A_MAP[0].length;
  for (let y = 0; y < 7; y++) {
    assert.strictEqual(grid[spacingCol][y], 0, `spacing column cell (${spacingCol},${y})`);
  }

  // remaining columns after the spacing should be zero
  for (let x = spacingCol + 1; x < grid.length; x++) {
    for (let y = 0; y < 7; y++) {
      assert.strictEqual(grid[x][y], 0, `cell (${x},${y}) after spacing`);
    }
  }
});

