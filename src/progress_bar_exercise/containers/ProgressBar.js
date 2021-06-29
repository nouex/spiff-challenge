import React from "react";
import { useState, useEffect, useRef, useReducer } from "react"
import ReactDOM from "react-dom"

import ProgressBar from "../components/ProgressBar"
import Btn from "../components/Btn"

const reducer = (state, action) => ({...state, ...action})
const init = { current: null, start: null, stop: null }

/**
 * 'time' holds the time we started the animation 'start', the current time
 * 'current', and the time when the animation will be complete 'end'
 *
 * 'progress' represents the same concept except it is a % value of where the
 * animation started 'start', were it stands 'currnet' and the goal 'end'
 *
 * There are two types of animations. One is when we click "Start Request" and
 * the goal is to get to 90% progress in 15 seconds. The second animation is
 * when we hit "Finish Request", the goal is to get from wherever we are in the
 * progress bar (leftOff) to 100% in 1 second.
 */

const ProgressBarContainer = () => {
  const [ time, setTime ] = useReducer(reducer, {...init})
  const [ progress, setProgress ] = useReducer(reducer, {...init})
  const [ started, setStarted ] = useState(false)
  const [ stopped, setStopped ] = useState(false)
  const [ hideBar, setHideBar ] = useState(true)
  const [ breakpoints, setBreakpoints ] = useState([]) // TODO: constraints: must be ordered, left pari must be less than right pair, length must be even
  const leftOff = useRef(0) // how much progress did we make when "Finish Request" was clicked

  const onStart = () => {
    const now = Date.now()
    const stop = now + (1000 * 15)

    setStarted(true)
    setHideBar(false)
    setTime({ start: now, stop, current: now})
    setProgress({ start: 0, stop: 90, current: 0 })
  }

  const onStop = () => {
    const now = Date.now()

    leftOff.current = progress.current
    setStopped(true)
    setTime({ start: now, stop: now + 1000 })
    setProgress({ start: progress.current, stop: 100 })
  }

  const reset = () => {
    setStarted(false)
    setStopped(false)
    setTime({...init})
    setProgress({...init})
    setHideBar(true)
    leftOff.current = null
  }

  /**
   * If there is an animation in progress, repeatedly change `time.current` state.
   * The rate at which we update is throttled by requestAnimationFrame()
   */
   useEffect(() => {
     if ([time.stop, time.start, progress.stop].includes(null)) return

     // kick start the progress bar
     if (time.current === null) {
       requestAnimationFrame(() => setTime({ current: Date.now() }))
       return
     }

     if (time.current < time.stop) {
       const bkpt = findBreakpoint(breakpoints, progress.current)
       let speed = 1
       if (bkpt) speed = 2

       setProgress({ current: calcProgress(progress, time, leftOff, speed) })
     } else {
       // when "Finish Request" is clicked
       // * after 3s fade the progress bar
       // * fading takes 1s, once complete reset everything
       if (stopped) {
         setTimeout(() => {
           setHideBar(true)
           setTimeout(reset, 1000)
         }, 1000 * 3)
       }
     }

     if (time.current < time.stop)
     requestAnimationFrame(() => setTime({ current: Date.now() }))

     // TODO: investigate why animation lags if we include 'progress' as depencency
   }, [time, progress.stop, stopped])


  // TODO: do we need to use portals here, avoid them if we can
  return (
    <>
      { ReactDOM.createPortal(<ProgressBar progress={progress.current} hide={hideBar}/>, document.body) }
      <Btn
        txt={started ? "LOADING..." : "START REQUEST"}
        color="green"
        onClick={onStart}
        disabled={started} />
      <Btn
        txt="FINISH REQUEST"
        color="red"
        onClick={onStop}
        disabled={!started || stopped} />
    </>
  )
}

export const calcProgress = (progress, time, leftOff, speed = 1) => {
  // 1. how much time until we hit our goal (time.stop - time.start)
  // 2. how long have we been running since we started (time.current - time.start)
  // 3. divide 2. by 1. to get our progress as a decimal
  // 4. take our distance to go (progress.stop - leftOff.current)
  // 5. how much progress (4.)  have we made as a percent of our goal (progress.stop - leftOff.current)
  // 6. aplpy any offset that we started with leftOff.current + ...
  // 7. increase/decrese the speed by a factor of 'speed'
  return leftOff.current + ((progress.stop - leftOff.current) * ((time.current - time.start) / (time.stop - time.start)) * speed)
}

// are we currently in between two breakpoints ?
export const findBreakpoint = (breakpoints, progress) => {
  let bkpt = null

  breakpoints.some((pair) => {
    if ((pair[0] <= progress) && pair[1] >= progress) {
      bkpt = pair
      return true
    }

    return false
  });

  return bkpt
}

export default ProgressBarContainer
