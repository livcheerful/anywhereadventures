import interact from "interactjs";

export function ScrapbookElem(type, htmlElem, id, z) {
  htmlElem.className = "cursor-pointer";
  this.type = type;
  this.z = z;
  this.id = id;
  this.elem = htmlElem;
  this.x = 0;
  this.y = 0;
  this.scale = 1;
  this.rotation = 0;
  const sticker = interact(htmlElem);

  const zoomSensitivity = 0.15; // lower = slower zoom
  const rotationSensitivity = 0.1;
  const updateTransform = () => {
    htmlElem.style.transform = `
      translate(${this.x}px, ${this.y}px)
      rotate(${this.rotation}deg)
      scale(${this.scale})
    `;
  };
  sticker.draggable({
    listeners: {
      move: (event) => {
        this.x += event.dx;
        this.y += event.dy;
        updateTransform();
      },
    },
  });

  sticker.gesturable({
    listeners: {
      start: (event) => {
        // this.rotate -= event.da * rotationSensitivity;
      },
      move: (event) => {
        const deltaScale = event.ds;
        this.scale *= 1 + deltaScale;
        this.x += event.delta.x;
        this.y += event.delta.y;
        this.rotation += event.da;
        console.log(event);
        updateTransform();
      },
    },
    end: (event) => {
      //   this.rotate = this.angle + event.angle;
      //   this.scale = this.scale * event.scale;
    },
  });
  htmlElem.style.left = window.innerWidth / 2;
  htmlElem.style.right = window.innerHeight / 2;
}
