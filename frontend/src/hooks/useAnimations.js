import { useEffect, useRef } from "react";
import gsap from "gsap";

export const useAnimateOnScroll = (selector, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const defaultOptions = {
      duration: 0.8,
      opacity: 0,
      y: 50,
      stagger: 0.1,
      ease: "power3.out",
      ...options,
    };

    const elements = ref.current.querySelectorAll(selector);
    gsap.from(elements, defaultOptions);
  }, [selector, options]);

  return ref;
};

export const useHoverAnimation = () => {
  return {
    onMouseEnter: (e) => {
      gsap.to(e.currentTarget, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    onMouseLeave: (e) => {
      gsap.to(e.currentTarget, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    },
  };
};

export const useClickAnimation = () => {
  return (e) => {
    const button = e.currentTarget;
    gsap
      .timeline()
      .to(button, { scale: 0.95, duration: 0.1 }, 0)
      .to(button, { scale: 1, duration: 0.2 });
  };
};

export const useEntrance = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      duration: 0.8,
      opacity: 0,
      y: 30,
      ease: "power3.out",
    });
  }, []);

  return ref;
};

export const useStaggerItems = (selector, delay = 0) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const items = ref.current.querySelectorAll(selector);
    gsap.from(items, {
      duration: 0.6,
      opacity: 0,
      y: 20,
      stagger: 0.1,
      ease: "power2.out",
      delay,
    });
  }, [selector, delay]);

  return ref;
};

export const usePulse = (selector) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current.querySelector(selector);
    if (!element) return;

    gsap.to(element, {
      duration: 2,
      scale: 1.05,
      opacity: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [selector]);

  return ref;
};

export const useCountUp = (targetValue, duration = 2) => {
  const ref = useRef(null);
  const countRef = useRef(0);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(countRef.current, {
      value: targetValue,
      duration,
      ease: "power1.inOut",
      onUpdate() {
        ref.current.textContent = Math.round(countRef.current.value);
      },
    });
  }, [targetValue, duration]);

  return ref;
};
