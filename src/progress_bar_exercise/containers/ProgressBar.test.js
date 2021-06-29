import { calcProgress } from "./ProgressBar"

describe("calcProgress()", () => {
  test("returns 0 if animation has not started", () => {
    // goal is fill 100% of progress bar
    const progress = {
      stop: 100
    }

    // we have not started
    const time = {
      start: 100,
      stop: 200,
      current: 100
    }

    // no offset
    const leftOff = { current: 0 }

    expect(calcProgress(progress, time, leftOff)).toBe(0)
  })

  test("returns 50 if halfway through animation", () => {
    // goal is fill 100% of progress bar
    const progress = {
      stop: 100
    }

    // we are exactly half way
    const time = {
      start: 100,
      stop: 200,
      current: 150
    }

    // no offset
    const leftOff = { current: 0 }

    expect(calcProgress(progress, time, leftOff)).toBe(50)
  })

  test("includes an offset if there is one", () => {
    // goal is fill 100% of progress bar
    const progress = {
      stop: 100
    }

    // we are exactly half way
    const time = {
      start: 100,
      stop: 200,
      current: 150
    }

    // offset of 10
    const leftOff = { current: 10 }

    expect(calcProgress(progress, time, leftOff)).toBeGreaterThan(50)
  })
})
