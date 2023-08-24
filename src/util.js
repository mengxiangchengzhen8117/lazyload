export function debounce(fun, millis = 200) {
  let self = this;
  let timeout;
	return (
    function (...args) {
      timeout && clearTimeout(timeout);
      timeout = setTimeout(function () {
        fun.call(self, ...args);
      }, millis || 200);
    }
  );
}