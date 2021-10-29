import React from "react";
import { minutesToDuration, secondsToDuration } from "../utils/duration";

export default function Session ({session, focusDuration, breakDuration, isTimerRunning}) {
    let timeProportion;
    if(session) {
        let duration = session.label === "Focusing" ? focusDuration : breakDuration;
        timeProportion = 100 - Math.round((session.timeRemaining / (duration*60)*100));
    }
   
    
    if(!session) return null;
    return (
        <div>
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
            <h2 data-testid="session-title">
              {session?.label} for {session?.label === "Focusing" ? minutesToDuration(focusDuration) : minutesToDuration(breakDuration)} minutes
            </h2>
            {/* TODO: Update message below correctly format the time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration(session?.timeRemaining)} remaining
            </p>
          </div>
        </div>
        {!isTimerRunning ? <h2>PAUSED</h2> : null}
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={timeProportion} // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: timeProportion + "%" }} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
      </div>
    )
}
