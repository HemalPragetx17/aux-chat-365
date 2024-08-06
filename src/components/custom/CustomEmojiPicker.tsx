// @ts-nocheck
import data from '@emoji-mart/data';
import { Picker } from 'emoji-mart';
import React, { useEffect, useRef } from 'react';

const CustomEmojiPicker = (props) => {
  const ref = useRef(null);
  const instance = useRef(null);

  if (instance.current) {
    instance.current.update(props);
  }

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window.customElements !== 'undefined'
    ) {
      if (!customElements.get('em-emoji-picker')) {
        customElements.define('em-emoji-picker', Picker);
      }
      instance.current = new Picker({ ...props, data, ref });
    }
    return () => {
      instance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.createElement('div', { ref });
};

export default CustomEmojiPicker;
