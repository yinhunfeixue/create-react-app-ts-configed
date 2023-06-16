/**
 * ScrollBarUtil
 */
class ScrollBarUtil {
  static listenScrollChange(
    target: HTMLDivElement,
    onChange: (data: { width: number; height: number }) => void
  ) {
    const observer: MutationObserver = new MutationObserver(
      (list, abserver) => {
        for (const item of list) {
          if (item.type === 'attributes') {
            const { offsetWidth, offsetHeight, scrollWidth, scrollHeight } =
              target;
            onChange({
              width: scrollWidth - offsetWidth,
              height: scrollHeight - offsetHeight,
            });
          }
        }
      }
    );

    observer.observe(target, {
      attributes: true,
      childList: true,
    });

    return () => {
      observer.disconnect();
    };
  }
}
export default ScrollBarUtil;
