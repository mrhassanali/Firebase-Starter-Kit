/**
 * useEffectAfterMount hook to run effect after first render (componentDidMount)
 * @param cb Callback function to run after first render
 * @param deps Dependency array
 * @returns void
 */
import { useEffect, useRef } from 'react';

export default function useEffectAfterMount(cb: () => void, deps: any[]) {
  const justMounted = useRef(true);

  useEffect(() => {
    if (!justMounted.current) {
      return cb();
    }
    justMounted.current = false;
  }, deps);
}
