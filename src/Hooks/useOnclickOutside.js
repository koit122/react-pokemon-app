import { useEffect } from "react";

export default function useOnclickOutside(ref, handler) {
  useEffect(() => {
    const xEl = document.querySelector('.modalclose');
    document.addEventListener('mousedown', function listener() {
      if (!ref.current.contains(event.target) || event.target == xEl) {
        handler();
      } else {
        return;
      }
      document.removeEventListener('mousedown', listener);
    });
  },[ref,handler])
}