window.EventSource = class {
  constructor(url) {
    this.listeners = {};
    fetch(url)
      .then(async (res) => {
        this.onopen?.({});
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          text
            .split('\n\n')
            .filter(Boolean)
            .forEach((line) => {
              const data = line.replace('data: ', '').trim();
              this.onmessage?.({ data });
              this.listeners['message']?.({ data });
            });
        }
      })
      .catch(() => this.onerror?.({}));
  }

  addEventListener(event, cb) {
    this.listeners[event] = cb;
  }
  removeEventListener(event) {
    delete this.listeners[event];
  }
  close() {}
};
