import React from "react";
import classnames from 'classnames';

import "./Btn.scss"

const Btn = ({ color, txt, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={classnames("btn small semi-bold", color, disabled ? "disabled" : null)}>
      {txt}
  </button>
)

export default Btn
