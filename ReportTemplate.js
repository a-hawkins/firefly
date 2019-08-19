class ReportTemplate {
    constructor() {
        this._dataIndex = 0;
    };
    set type(name) {
        this._type = name;
    };
    get type() {
        return this._type;
    };
    set description(desc) {
        this._description = desc;
    };
    get description() {
        return this._description;
    };
    set data(dataArray) {
        this._data = dataArray;
    };
    get data() {
        return this._data;
    };
    get hasNextData() {
        if (this._data[this._dataIndex])
            return true;
        return false;
    };
    nextData() {
        if (this.hasNextData) {
            var currIndex = this._dataIndex;
            this._dataIndex = this._dataIndex + 1;
            return this._data[currIndex];
        }
    };

};

module.exports.ReportTemplate = ReportTemplate;
