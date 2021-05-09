let buttonShapes = {
    hidden: (context, button, node) => {},
    attributeButton: (context, button, node) => {
        if(!node.element.attributes || node.element.attributes.length == 0) {
            return;
        }
        
        context.beginPath();
        context.rect(button.point.x, button.point.y, button.size.width, button.size.height);
        context.stroke();

        let x = button.point.x + 5.5;
        let y = button.point.y + (button.size.width / 4);

        context.beginPath();
        context.arc(x, y, button.size.width / 8, 0, 2 * Math.PI);
        context.fill();

        context.beginPath();
        context.arc(x + 7, y, button.size.width / 8, 0, 2 * Math.PI);
        context.fill();

        context.beginPath();
        context.arc(x + 14, y, button.size.width / 8, 0, 2 * Math.PI);
        context.fill();
    },
    collapseButton: (context, button, node) => {
        if(node.children.length == 0) {
            return;
        }
        
        context.beginPath();
        context.font = '18px Arial';
        context.textAlign = 'center';
        context.fillText(node.isCollapsed ? "+" : "-", button.point.x, button.point.y);

        context.beginPath();
        context.rect(button.minX, button.minY, button.size.width, button.size.height);
        context.stroke();
    }
}

class Button {
    /**
     * @param {string} type changes how the button calculate its boundaries
     * @param {Point} point button location
     * @param {Size} size button size
     * @param {callback} drawFunc button drawing function
     */
    constructor(type, point, size, drawFunc) {
        this.type = type;
        this.point = point;
        this.size = size;
        
        if(type !== "collapse button") {
            this.minX = point.x;
            this.minY = point.y;
            this.maxX = point.x + size.width;
            this.maxY = point.y + size.height;
        } else {
            this.minX = point.x - (size.width / 2);
            this.minY = point.y - (size.height * 0.75);
            this.maxX = this.minX + size.width;
            this.maxY = this.minY + size.height;
        }

        this.drawFunc = drawFunc;
        this.onClick = null;
        this.node = null;
    }

    loadNode(node) {
        this.node = node;
    }

    draw(context) {
        this.drawFunc(context, this, this.node);
    }
    
    contains(mousePoint) {
        let containsX = this.minX <= mousePoint.x && mousePoint.x <= this.maxX;
        let containsY = this.minY <= mousePoint.y && mousePoint.y <= this.maxY;
        return containsX && containsY;
    }

    click() {
        if(this.onClick) {
            this.onClick();
        }
    }
}