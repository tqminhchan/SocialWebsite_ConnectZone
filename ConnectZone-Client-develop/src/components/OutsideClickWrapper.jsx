import PropTypes from "prop-types";
import { useEffect, useRef } from "react";


const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target) || null)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

function OutsideClickWrapper(props) {
  const squareBoxRef = useRef(null);

  useOnClickOutside(squareBoxRef, props.onClickOutside);
  return <div ref={squareBoxRef}>{props.children}</div>;
}

OutsideClickWrapper.propTypes = {
  children: PropTypes.element.isRequired,
};

export default OutsideClickWrapper;