import { debounce } from "lodash";

export class ScrollSnap {
    // orientation: 1 = x, 2 = y, 3 = xy
    constructor(element: HTMLElement, orientation: number, snap_container: HTMLElement, snap_query: string) {
      element.addEventListener(
        "scroll",
        debounce(() => {
          const bounding_rect = element.getBoundingClientRect();
          const snap_elements = [...snap_container.querySelectorAll(snap_query) as any];
          const snap_bounding_rects = snap_elements.map(
            (snap_element) => snap_element.getBoundingClientRect(),
          );
          const scroll_options = { inline: "center", block: "nearest", behavior: "smooth" };
  
          if (element[orientation == 1 ? "scrollLeft" : "scrollTop"] == 0) {
            let min_index = 0;
            let min_bounding_rect = snap_bounding_rects[min_index];
  
            snap_bounding_rects.forEach((snap_bounding_rect, index) => {
              if (
                orientation == 1
                  ? snap_bounding_rect.x < min_bounding_rect.x
                  : snap_bounding_rect.y < min_bounding_rect.y
              ) {
                min_bounding_rect = snap_bounding_rect;
                min_index = index;
              }
            });
            snap_elements[min_index].scrollIntoView(scroll_options);
  
            return;
          }
          if (
            orientation == 1
              ? (element.scrollLeft == element.scrollWidth - bounding_rect.width)
              : (element.scrollTop == element.scrollHeight - bounding_rect.height)
          ) {
            let max_index = 0;
            let max_bounding_rect = snap_bounding_rects[max_index];
  
            snap_bounding_rects.forEach((snap_bounding_rect, index) => {
              if (
                orientation == 1
                  ? snap_bounding_rect.x > max_bounding_rect.x
                  : snap_bounding_rect.y > max_bounding_rect.y
              ) {
                max_bounding_rect = snap_bounding_rect;
                max_index = index;
              }
            });
            snap_elements[max_index].scrollIntoView(scroll_options);
  
            return;
          }
  
          const snap_distances = snap_bounding_rects
            .map(
              (snap_bounding_rect) => {
                return Math.abs(
                  orientation == 1
                    ? (bounding_rect.left +
                      (bounding_rect.right - bounding_rect.left) / 2 -
                      snap_bounding_rect.width / 2 -
                      snap_bounding_rect.x)
                    : (bounding_rect.top +
                      (bounding_rect.bottom - bounding_rect.top) / 2 -
                      snap_bounding_rect.height / 2 -
                      snap_bounding_rect.y),
                );
              },
            );
  
          snap_elements.find((_, index) =>
            snap_distances[index] <
              snap_bounding_rects[index][orientation == 1 ? "width" : "height"] /
                2 &&
            snap_distances[index] > 0
          )?.scrollIntoView(scroll_options);
        }, 150),
        { passive: true },
      );
    }
  }