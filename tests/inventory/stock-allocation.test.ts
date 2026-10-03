import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { distributeTotalStock } from "../../lib/services/stock-allocation";

describe("distributeTotalStock", () => {
  it("distributes an uneven total without losing units", () => {
    const allocations = distributeTotalStock(10, 3);
    assert.deepEqual(allocations, [4, 3, 3]);
    assert.equal(allocations.reduce((sum, quantity) => sum + quantity, 0), 10);
  });

  it("handles zero stock and totals smaller than the variant count", () => {
    assert.deepEqual(distributeTotalStock(0, 4), [0, 0, 0, 0]);
    assert.deepEqual(distributeTotalStock(2, 4), [1, 1, 0, 0]);
  });

  it("rejects invalid totals and variant counts", () => {
    assert.throws(() => distributeTotalStock(-1, 2), RangeError);
    assert.throws(() => distributeTotalStock(1.5, 2), RangeError);
    assert.throws(() => distributeTotalStock(1, 0), RangeError);
  });
});
