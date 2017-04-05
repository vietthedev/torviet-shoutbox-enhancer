class Emoticon {
    constructor(name) {
        this.name = name;
    }

    toString() {
        return `<div style="height:43px;width:43px;float:left;display:inline-block;margin:0 0 1px 1px;">
            "<img style="max-width: 43px; max-height: 43px; cursor: pointer;" src="/pic/smilies/
            ${this.name}.gif" alt="[em${this.name}]"></div>`;
    }
}
