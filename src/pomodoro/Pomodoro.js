import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import {minutesToDuration} from "../utils/duration";
import Session from "./Session.js"
import SetTimerButtons from "./SetTimerButtons";
import TimerControls from "./TimerControls";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  function handleDecreaseFocus() {
    if(focusDuration === 5) return;
    setFocusDuration(state => state - 5);
  }

  function handleIncreaseFocus() {
    if(focusDuration === 60) return;
    setFocusDuration(state => state + 5);
  }

  function handleDecreaseBreak() {
    if(breakDuration === 1) return;
    setBreakDuration(state => state - 1);
  }

  function handleIncreaseBreak() {
    if(breakDuration === 15) return;
    setBreakDuration(state => state + 1);
  }

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  function handleStop() {
    setIsTimerRunning(false);
    setSession(null);
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <SetTimerButtons 
                direction="decrease" 
                mode="focus" 
                handle={handleDecreaseFocus} 
                session={session} 
              />
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <SetTimerButtons 
                direction="increase" 
                mode="focus" 
                handle={handleIncreaseFocus} 
                session={session} 
              />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <SetTimerButtons 
                  direction="decrease" 
                  mode="break" 
                  handle={handleDecreaseBreak} 
                  session={session} 
                />
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <SetTimerButtons 
                  direction="increase" 
                  mode="break" 
                  handle={handleIncreaseBreak} 
                  session={session} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <TimerControls 
        playPause={playPause} 
        session={session} 
        handleStop={handleStop} 
        isTimerRunning={isTimerRunning} 
        classNames={classNames} 
      />
      <Session 
        session={session} 
        focusDuration={focusDuration} 
        breakDuration={breakDuration} 
        isTimerRunning={isTimerRunning}
      />
    </div>
  );
}

export default Pomodoro;
