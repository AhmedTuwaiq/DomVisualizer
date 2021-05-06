class HTMLNode {
    constructor(parent, point, size, element) {
        this.parent = parent;
        this.children = [];
        this.point = point;
        this.head = new Point(0, 0);
        this.tail = new Point(0, 0);
        this.size = size;
        this.element = element;
        this.isActive = true;
        this.isCollapsed = false;
        this.attrShown = false;
        this.htmlShown = false;
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

        if(this.attrShown) {
            this.drawAttr(context);
        }

        if(this.htmlShown) {
            this.drawHTML();
        }
    }

    drawControls(context) {
        this.drawAttrButton(context);
        this.drawExColButton(context);
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

    drawExColButton(context) {
        if(this.children.length > 0) {
            context.beginPath();
            context.font = '10px Arial';
            context.textAlign = 'center';
            context.fillText(this.isCollapsed ? "+" : "-", this.point.x - (this.size.width / 2) - 5, this.point.y + 20);
        }
    }

    drawAttrButton(context) {
        if(!this.element.attributes || this.element.attributes.length == 0) {
            return;
        }

        context.beginPath();
        context.rect(this.point.x - this.size.width + 10, this.point.y - (this.size.height / 4), this.size.width / 4, this.size.height / 4);
        context.stroke();
    }

    attrContains(point) {
        if(!this.element.attributes || this.element.attributes.length == 0) {
            return false;
        }

        let minX = this.point.x - this.size.width + 10;
        let minY = this.point.y - (this.size.height / 4);
        let maxX = minX + this.size.width / 4;
        let maxY = minY + this.size.height / 4;

        return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
    }

    exColContains(point) {
        if(this.children.length <= 0) {
            return false;
        }

        let x = this.point.x - (this.size.width / 2) - 5;
        let y = this.point.y + 20;
        let size = 5;
        let minX = x - size;
        let minY = y - size;
        let maxX = x + size;
        let maxY = y + size;

        return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
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

    collapse() {
        for(let child of this.children) {
            child.isActive = false;
            child.collapse();
        }
    }

    expand() {
        if(this.isCollapsed) {
            return;
        }

        for(let child of this.children) {
            child.isActive = true;
            child.expand();
        }
    }

    contains(point) {
        let x = this.point.x - (this.size.width / 2);
        let y = this.point.y - (this.size.height / 2);
        let containsX = x <= point.x && point.x <= x + this.size.width;
        let containsY = y <= point.y && point.y <= y + this.size.height;
        return containsX && containsY;
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
    }
}