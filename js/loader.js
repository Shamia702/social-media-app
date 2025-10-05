export const loader = {
  element: document.getElementById("loader"),

  show() {
    if (this.element) this.element.classList.remove("d-none");
  },

  hide() {
    if (this.element) this.element.classList.add("d-none");
  },
};
