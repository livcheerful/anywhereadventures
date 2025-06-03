import interact from "interactjs";

export function ScrapbookElem(
  handleDraggingItem,
  type,
  htmlElem,
  id,
  z,
  imgSrc,
  origWidth,
  origHeight
) {
  htmlElem.className = "cursor-pointer trashable";
  this.type = type;
  this.z = z;
  this.id = id;
  this.elem = htmlElem;
  this.x = 0;
  this.y = 0;
  this.scale = 1;
  this.rotation = 0;
  this.imgSrc = imgSrc;

  this.originalWidth = origWidth;
  this.originalHeight = origHeight;
  const sticker = interact(htmlElem);
  const updateTransform = () => {
    htmlElem.style.transform = `
      translate(${this.x}px, ${this.y}px)
      rotate(${this.rotation}deg)
      scale(${this.scale})
    `;
  };
  sticker.draggable({
    listeners: {
      start: (event) => {
        handleDraggingItem(this);
      },
      move: (event) => {
        this.x += event.dx;
        this.y += event.dy;
        updateTransform();
      },
      end: (event) => {
        handleDraggingItem(undefined);
      },
    },
  });

  sticker.gesturable({
    listeners: {
      start: (event) => {
        // this.rotate -= event.da * rotationSensitivity;
        handleDraggingItem(this);
      },
      move: (event) => {
        const deltaScale = event.ds;
        this.scale *= 1 + deltaScale;
        this.x += event.delta.x;
        this.y += event.delta.y;
        this.rotation += event.da;
        updateTransform();
      },
    },
    end: (event) => {
      //   this.rotate = this.angle + event.angle;
      //   this.scale = this.scale * event.scale;
      handleDraggingItem(undefined);
    },
  });
  htmlElem.style.left = window.innerWidth / 2;
  htmlElem.style.right = window.innerHeight / 2;
}
