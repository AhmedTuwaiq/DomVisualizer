class Dom {
    constructor(root, canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.root = root;
        this.levels = [[root]];
        this.margin = 100;
        this.maxWidth = 0;
        this.nodeSize = 50;

        this.buildLevels();
        this.setNodePoints();
    }

    buildLevels() {
        this.levels.push([]);
        let index = this.levels.length - 1;
        let previousLevel = this.levels[index - 1];
        
        for(let parent of previousLevel) {
            if(parent.element.tagName === "SCRIPT") {
                continue;
            }

            for(let child of parent.element.childNodes) {
                let node = new HTMLNode(parent, new Point(0, 0), new Size(this.nodeSize, this.nodeSize), child);
                parent.appendChild(node);
                this.levels[index].push(node);
            }
        }

        if(this.levels[this.levels.length - 1].length == 0) {
            this.canvas.width = this.maxWidth;
            this.canvas.height = this.levels.length * (this.nodeSize + this.margin);
            this.levels.pop();
        } else {
            let levelWidth = this.levels[this.levels.length - 1].length * (this.nodeSize + this.margin);

            if(this.maxWidth < levelWidth) {
                this.maxWidth = levelWidth;
            }

            this.buildLevels();
        }
    }

    reset() {
        this.levels = [[this.root]];
    }
    
    draw() {
        for(let level of this.levels) {
            for(let node of level) {
                if(node.isActive == true) {
                    node.draw(this.context);
                }
            }
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    redraw() {
        this.clear();
        this.draw();
    }

    setNodePoints() {
        let y = 100;

        for (let level of this.levels) {
            let x = (this.maxWidth / 2) + 100;
            x -= ((level.length / 2) * (this.margin + this.nodeSize));

            for(let node of level) {
                node.moveTo(new Point(x, y));
                x += node.size.width + this.margin;
            }

            y += this.nodeSize + this.margin;
        }
    }
}