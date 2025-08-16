import myImage from '@/assets/imgs/loading.gif';
export default {
  mounted(el: HTMLImageElement, binding: any) {
    el.src = myImage
    const loadImage = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        el.src = binding.value;
        observer.unobserve(el);
      }
    };
    const observer = new IntersectionObserver(loadImage, { root: null, threshold: 0.1 });
    observer.observe(el);
    (el as any).__lazyObserver__ = observer; // 绑定 observer 到元素
  },
  unmounted(el: HTMLImageElement) {
    if ((el as any).__lazyObserver__) {
      (el as any).__lazyObserver__.disconnect();
    }
  }
};