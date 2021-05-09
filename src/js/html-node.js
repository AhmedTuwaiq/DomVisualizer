class HTMLNode {
    constructor(parent, point, size, element) {
        this.parent = parent;
        this.children = [];
        this.point = point;
        this.head = new Point(0, 0);
        this.tail = new Point(0, 0);
        this.size = size;
        this.element = element;
        this.isCollapsed = false;
        this.attributesVisible = false;
        this.htmlShown = false;
        this.isActive = true;
    }

    buildButtons() {
        // attribute button location
        let attrX = this.point.x - (this.size.width + 5);
        let attrY = this.point.y - (this.size.height / 4);
        let attrPoint = new Point(attrX, attrY);

        // attribute button size
        let attrWidth = this.size.width / 2;
        let attrHeight = this.size.height / 4;
        let attrSize = new Size(attrWidth, attrHeight);

        /**
         * note:-
         * this is the center point for the collapse button
         * unlike the node and attribute button
         * they require the top left corner point
         */
        
        // collapse button location
        let colX = this.point.x - (this.size.width / 2) - 10;
        let colY = this.point.y + 20;
        let colPoint = new Point(colX, colY);

        // collapse button size
        let colSize = new Size(18, 18);

        // adding buttons
        this.buttons = {
            nodeButton: new Button("node button", new Point(this.point.x - (this.size.width / 2), this.point.y - (this.size.height / 2)), this.size, buttonShapes.hidden),
            attributeButton: new Button("attribute button", attrPoint, attrSize, buttonShapes.attributeButton),
            collapseButton: new Button("collapse button", colPoint, colSize, buttonShapes.collapseButton)
        };

        // lazy load this node into the buttons to avoid circular dependency
        this.buttons.nodeButton.node = this;
        this.buttons.attributeButton.node = this;
        this.buttons.collapseButton.node = this;

        // callbacks
        this.buttons.attributeButton.onClick = () => { this.toggleAttributesView() };
        this.buttons.collapseButton.onClick = () => { this.toggleIsCollapsed() };
    }

    toggleAttributesView() {
        this.attributesVisible = !this.attributesVisible;
    }

    toggleIsCollapsed() {
        this.isCollapsed = !this.isCollapsed;

        for(let child of this.children) {
            child.toggleActive();
        }
    }

    toggleActive() {
        this.isActive = !this.isActive;

        if(!this.isCollapsed) {
            for(let child of this.children) {
                child.isActive = this.isActive;
            }
        }
    }

    draw(context) {
        this.drawLink(context);

        if(this.element.nodeType !== Node.TEXT_NODE) {
            context.beginPath();
            context.arc(this.point.x, this.point.y, this.size.width / 2, 0, 2 * Math.PI);
            context.stroke();

            this.drawNodeName(context);
        } else {
            context.beginPath();
            context.rect(this.point.x - (this.size.width / 2), this.point.y - (this.size.height / 2), this.size.width, this.size.height);
            context.stroke();

            this.drawNodeName(context);
        }

        this.drawControls(context);

        if(this.attributesVisible) {
            this.drawAttr(context);
        }

        if(this.htmlShown) {
            this.drawHTML();
        }

        if(!this.isCollapsed) {
            for(let child of this.children) {
                child.draw(context);
            }
        }
    }

    drawControls(context) {
        for (let key in this.buttons) {
            if (this.buttons.hasOwnProperty(key)) {
                this.buttons[key].draw(context);
            }
        }
    }

    drawHTML() {
        context.beginPath();
        context.rect(this.point.x - this.size.width, this.point.y - this.size.height - 10, this.size.width * 2, this.size.height / 2);
        context.fillStyle = "white";
        context.fill();
        context.stroke();
        context.fillStyle = "black";
        context.beginPath();
        context.font = '10px Arial';
        context.textAlign = 'center';
        let value = this.element.nodeValue;

        if(value) {
            value = value.replace("\n", "\\n");
            value = value.replace("\t", "\\t");
            value = value.replace("\r", "\\r");
        }

        context.fillText(this.element.outerHTML ? this.element.outerHTML : value, this.point.x, this.point.y - this.size.height + 5);
    }

    drawAttr(context) {
        if(!this.element.attributes || this.element.attributes.length == 0) {
            return;
        }

        let x = this.point.x - this.size.width - 100;
        let y = this.point.y - 30;

        context.beginPath();
        context.rect(x - 50, y - 15, 100, 100);
        context.fillStyle = "white";
        context.fill();
        context.stroke();
        context.fillStyle = "black";

        for(let i = 0; i < this.element.attributes.length; i++) {
            let attr = this.element.attributes[i];

            context.beginPath();
            context.font = '14px Arial';
            context.textAlign = 'center';
            context.fillText(`${attr.name}: ${attr.value}`, x, y);
            y += 12;
        }
    }

    drawLink(context) {
        if(this.parent != null) {
            context.beginPath();
            context.moveTo(this.head.x, this.head.y);
            context.lineTo(this.parent.tail.x, this.parent.tail.y);
            context.stroke();
        }
    }

    drawNodeName(context) {
        context.beginPath();
        context.font = '8px Arial';
        context.textAlign = 'center';

        if(this.element.nodeType !== Node.TEXT_NODE) {
            context.fillText(this.element.nodeName, this.point.x, this.point.y);
        } else {
            let value = this.element.nodeValue;
            value = value.replace("\n", "\\n");
            value = value.replace("\t", "\\t");
            value = value.replace("\r", "\\r");
            context.fillText(value, this.point.x, this.point.y);
        }
    }

    appendChild(child) {
        this.children.push(child);
    }
    
    moveTo(point) {
        let dx = point.x - this.point.x;
        let dy = point.y - this.point.y;

        for(let child of this.children) {
            let chPoint = new Point(child.point.x + dx, child.point.y + dy);
            child.moveTo(chPoint);
        }

        this.point = point;
        this.head = new Point(point.x, point.y - (this.size.height / 2));
        this.tail = new Point(point.x, point.y + (this.size.height / 2));
        this.buildButtons();
    }
}