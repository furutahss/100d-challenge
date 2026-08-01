import { describe, expect, it } from "vitest";
import { createBalls, difficultyFor, moveBall, nextTarget, scoreTap } from "./game";

describe("game rules", () => {
  it("ターゲット色を必ず含むボールを作る", () => {
    const balls = createBalls("coral", 5, () => 0.5);
    expect(balls).toHaveLength(5);
    expect(balls.some((ball) => ball.color === "coral")).toBe(true);
  });

  it("次のお題は現在のお題と異なる", () => {
    expect(nextTarget("blue", () => 0)).not.toBe("blue");
  });

  it("正解は加点、誤タップは減点し0未満にはしない", () => {
    expect(scoreTap(true, 20)).toBe(30);
    expect(scoreTap(false, 20)).toBe(15);
    expect(scoreTap(false, 0)).toBe(0);
  });

  it("ボールはゲームエリア内で難易度に応じて移動する", () => {
    const ball = { id: 1, color: "blue" as const, x: 50, y: 50, size: 56 };
    expect(moveBall(ball, difficultyFor(0), () => 1)).toMatchObject({ x: 70, y: 68 });
    expect(moveBall({ ...ball, x: 84, y: 81 }, difficultyFor(0), () => 1)).toMatchObject({ x: 84, y: 82 });
    expect(moveBall({ ...ball, x: 6, y: 10 }, difficultyFor(0), () => 0)).toMatchObject({ x: 6, y: 10 });
  });

  it("正解するごとにボール数が増え、移動が速く大きくなる", () => {
    const easy = difficultyFor(0);
    const harder = difficultyFor(4);
    expect(easy).toMatchObject({ ballCount: 6, interval: 2600, horizontalDistance: 20, verticalDistance: 18 });
    expect(easy.duration).toBeGreaterThan(easy.interval);
    expect(harder.ballCount).toBeGreaterThan(easy.ballCount);
    expect(harder.interval).toBeLessThan(easy.interval);
    expect(harder.horizontalDistance).toBeGreaterThan(easy.horizontalDistance);
  });
});
