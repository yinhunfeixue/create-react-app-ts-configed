/**
 * ScrollBarUtil
 */
class ScrollBarUtil {
  static listenScrollChange(
    container: HTMLElement,
    content: HTMLElement,
    onChange: (data: { width: number; height: number }) => void
  ) {
    const resizeHandler = () => {
      const { clientWidth, clientHeight, scrollWidth, scrollHeight } =
        container;

      onChange({
        width: scrollWidth - clientWidth,
        height: scrollHeight - clientHeight,
      });
    };

    const containerObserver = new ResizeObserver(resizeHandler);
    const contentObserver = new ResizeObserver(resizeHandler);

    containerObserver.observe(container);
    contentObserver.observe(content);

    resizeHandler();

    return () => {
      containerObserver.disconnect();
      contentObserver.disconnect();
    };
  }
}
export default ScrollBarUtil;
