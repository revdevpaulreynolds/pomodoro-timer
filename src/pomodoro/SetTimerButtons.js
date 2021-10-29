import React from "react";

export default function SetTimerButtons({direction, mode, handle, session}) {
    let testid = `${direction}-${mode}`;
    let side = `oi oi-${direction === "decrease" ? "minus" : "plus"}`
    
    return (
        <button
                type="button"
                className="btn btn-secondary"
                data-testid={testid}
                onClick={handle}
                disabled={session}
                >
                <span className={side} />
              </button>
    )
}