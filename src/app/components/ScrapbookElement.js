import interact from "interactjs";

export function ScrapbookElem({
  handleDraggingItem,
  getDraggingItem,
  type,
  htmlElem,
  id,
  z,
  origWidth,
  origHeight,
  imgSrc,
  textSrc,
  props,
  onClick,
}) {
  htmlElem.setAttribute("class", "cursor-pointer trashable");
  this.type = type;
  this.z = z;
  this.id = id;
  this.elem = htmlElem;
  this.x = 0;
  this.y = 0;
  this.scale = 1;
  this.rotation = 0;
  this.imgSrc = imgSrc;
  this.textSrc = textSrc;
  this.props = props;

  this.elem.style.zIndex = z;

  htmlElem.style.touchAction = "none";
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
        // VVN TODO: prevent multi drag by checking getDraggingItem()
        handleDraggingItem(this);
      },
      move: (event) => {
        this.x += event.dx;
        this.y += event.dy;
        updateTransform();
      },
      end: (event) => {
        event.stopPropagation();
        event.preventDefault();
        handleDraggingItem(undefined);
      },
    },
  });
  sticker.on("click", (e) => {
    e.stopPropagation();
    const draggingItem = getDraggingItem();
    if (!draggingItem) {
      onClick(this);
    }
  });

  sticker.gesturable({
    listeners: {
      start: (event) => {
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
}
