import { useState } from "react";

export default function usePasswordVisibility(initialState = {}) {
  const [passVisibility, setPassVisibility] = useState(initialState);
  const handlePassVisibility = (fieldName) => {
    setPassVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };
  return [passVisibility,handlePassVisibility,setPassVisibility];
}