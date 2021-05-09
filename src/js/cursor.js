class Cursor {
    constructor(dom, canvas) {
        this.canvas = canvas;
        this.dom = dom;
        this.selectedNode = null;
        this.delta = new Point(0, 0);
        this.hoveredOverNode = null;

        this.onMouseDown.bind(this);
        this.onClick.bind(this);
        this.onDoubleClick.bind(this);
        this.onMove.bind(this);
        this.onMouseUp.bind(this);
    }

    getXY(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const y = event.clientY - rect.top;
        const x = event.clientX - rect.left; 
        return new Point(x, y);
    }

    onMouseDown(event) {
        let mousePoint = this.getXY(this.canvas, event);

        for(let level of this.dom.levels) {
            for(let node of level) {
                if(node.isActive) {
                    if(node.buttons.nodeButton.contains(mousePoint)) {
                        this.selectedNode = node;
                        this.delta = new Point(mousePoint.x - node.point.x, mousePoint.y - node.point.y);

                        if(this.hoveredOverNode) {
                            this.hoveredOverNode.htmlShown = false;
                            this.hoveredOverNode = null;
                        }
                        return;
                    }
                }
            }
        }
    }
    
    onClick(event) {
        let mousePoint = this.getXY(this.canvas, event);

        for(let level of this.dom.levels) {
            for(let node of level) {
                if(node.isActive) {
                    if(node.buttons.collapseButton.contains(mousePoint) && node.children.length > 0) {
                        node.buttons.collapseButton.click();
                        this.dom.redraw();
                        break;
                    } else if(node.buttons.attributeButton.contains(mousePoint) && node.element.attributes && node.element.attributes.length > 0) {
                        node.buttons.attributeButton.click();
                        this.dom.redraw();
                        return;
                    }
                }
            }
        }
    }

    onDoubleClick(event) {
        let mousePoint = this.getXY(this.canvas, event);

        for(let level of this.dom.levels) {
            for(let node of level) {
                if(node.isActive && node.element.nodeType !== Node.TEXT_NODE && node.element.tagName != "SCRIPT") {
                    if(node.buttons.nodeButton.contains(mousePoint)) {
                        let tagName = prompt("Please enter tag name", "");
                        if(tagName.length != 0) {
                            let element = document.createElement(tagName);
                            node.element.appendChild(element);
                            this.dom.reset();
                            this.dom.buildLevels();
                            this.dom.setNodePoints();
                            this.dom.redraw();
                        }
                        break;
                    } else if(node.buttons.attributeButton.contains(mousePoint)) {
                        node.buttons.attributeButton.click();
                        this.dom.redraw();
                        break;
                    }
                }
            }
        }
    }

    onMove(event) {
        let mousePoint  = this.getXY(this.canvas, event);

        if(this.selectedNode) {
            let x = mousePoint.x - this.delta.x;
            let y = mousePoint.y - this.delta.y;

            this.selectedNode.moveTo(new Point(x, y));
            this.dom.redraw();
            return;
        }

        for(let level of this.dom.levels) {
            for(let node of level) {
                if(node.buttons.nodeButton.contains(mousePoint)) {
                    if(this.hoveredOverNode) {
                        this.hoveredOverNode.htmlShown = false;
                    }

                    node.htmlShown = true;
                    this.hoveredOverNode = node;
                    this.dom.redraw();
                    return;
                }
            }
        }
        
        if(this.hoveredOverNode) {
            this.hoveredOverNode.htmlShown = false;
            this.hoveredOverNode = null;
            this.dom.redraw();
        }
    }

    onMouseUp() {
        this.selectedNode = null;
    }
}