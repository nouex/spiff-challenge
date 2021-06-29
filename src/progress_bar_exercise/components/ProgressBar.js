import React from "react";
import cn from 'classnames';

import "./ProgressBar.scss"

const ProgressBar = ({ color, txt, progress, hide }) => {
  const width = `${100 - progress}%`

  return (
    <div className={cn("progress-bar", hide ? "fade-out" : null)}>
      <div className="whiteout" style={{width}}></div>
    </div>
  )
}

export default ProgressBar
