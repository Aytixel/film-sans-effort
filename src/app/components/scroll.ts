import { debounce } from "lodash";

export class Scroll {
  __orientation;
  __element: HTMLElement;
  __last_position = { x: 0, y: 0 };
  __deceleration = 0.85;
  __hold = false;
  __last_hold = false;
  __running = false;

  // orientation: 1 = x, 2 = y, 3 = xy
  constructor(element: HTMLElement, orientation: number = 0) {
    this.__orientation = orientation;
    this.__element = element;
    this.__element.style.overflow = "hidden";

    element.addEventListener(
      "wheel",
      this.__wheel,
      { passive: true },
    );
    element.addEventListener("pointerdown", this.__pointer_start);
  }

  __wheel = (event: any) => {
    this.__element.style.scrollBehavior = "auto";
    this.__element.style.scrollSnapType = "none";

    this.apply_scroll(event.deltaX, event.deltaY, event.shiftKey);
  };

  __pointer_start = (event: any) => {
    this.__hold = true;
    this.__last_position.x = event.clientX;
    this.__last_position.y = event.clientY;
    this.__element.style.scrollBehavior = "auto";
    this.__element.style.scrollSnapType = "none";

    this.__element.addEventListener("pointermove", this.__pointer_move, {
      passive: true,
    });

    this.__element.addEventListener("pointerup", this.__pointer_end);
    this.__element.addEventListener("pointerleave", this.__pointer_end);
    this.__element.addEventListener(
      "lostpointercapture",
      this.__pointer_end,
    );
  };

  __pointer_move = (event: any) => {
    window.requestAnimationFrame(() => {
      this.apply_scroll(
        this.__last_position.x - event.clientX,
        this.__last_position.y - event.clientY,
        false,
        false,
      );

      this.__last_position.x = event.clientX;
      this.__last_position.y = event.clientY;
    });
  };

  __pointer_end = () => {
    this.__element.removeEventListener(
      "pointermove",
      this.__pointer_move,
    );

    this.__element.removeEventListener("pointerup", this.__pointer_move);
    this.__element.removeEventListener("pointerleave", this.__pointer_end);
    this.__element.removeEventListener(
      "lostpointercapture",
      this.__pointer_end,
    );

    this.__hold = false;

    this.__reset_scroll_style();
  };

  apply_scroll(x: number, y: number, shift = false, is_wheel = true) {
    if (is_wheel) {
      this.__hold = false;
      this.__running = false;
    }

    if (this.__last_hold && !this.__hold) {
      const boost_multiplier = Math.min(
        Math.max(
          Math.log2(window.innerHeight / window.innerWidth),
          1,
        ),
        1.25,
      );

      x *= boost_multiplier;
      y *= boost_multiplier;
    }

    if (!this.__hold) {
      const x_stop = Math.abs(x) < 1;
      const y_stop = Math.abs(y) < 1;
      x *= this.__deceleration;
      y *= this.__deceleration;

      if (x_stop) x = 0;
      if (y_stop) y = 0;
      if (x_stop && y_stop) this.__running = false;
    }

    if (!this.__running && this.__hold) this.__running = true;

    window.requestAnimationFrame(() => {
      if (this.__orientation == 1) {
        if (is_wheel && shift) this.__element.scrollLeft += y;
        this.__element.scrollLeft += x;
      }
      if (this.__orientation == 2) {
        if (is_wheel && shift) this.__element.scrollTop += x;
        this.__element.scrollTop += y;
      }
      if (this.__orientation == 3) {
        if (is_wheel && shift) {
          this.__element.scrollTop += x;
          this.__element.scrollLeft += y;
        } else {
          this.__element.scrollTop += y;
          this.__element.scrollLeft += x;
        }
      }

      if (this.__running && !this.__hold) {
        this.apply_scroll(x, y, shift, is_wheel);
      }
      if (!is_wheel) this.__reset_scroll_style();

      this.__last_hold = this.__hold;
    });
  }

  __reset_scroll_style = debounce(() => {
    if (!this.__hold) {
      this.__element.style.scrollBehavior = "";
      this.__element.style.scrollSnapType = "";
    }
  }, 50);
}