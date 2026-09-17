import React from "react";
import RoundIconButton from "../RoundIconButton";
import { NEXT_ICON } from "../../../constants/media";

const NextButton = ({ icon, onClick, isDisabled, label = "Ďalej" }) => (
  <RoundIconButton
    icon={icon || NEXT_ICON}
    label={label}
    onClick={onClick}
    disabled={isDisabled}
  />
);

export default NextButton;
