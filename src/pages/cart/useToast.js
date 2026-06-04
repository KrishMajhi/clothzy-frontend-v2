import { useState, useRef } from "react";

const useToast = () => {
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = (msg, toastIcon = "✓") => {
    setMessage(msg);
    setIcon(toastIcon);
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 3000);
  };

  return { message, icon, visible, show };
};

export default useToast;
