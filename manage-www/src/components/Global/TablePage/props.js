const props = {
    // Table Attributes
    data: Array,
    border: {
        type: Boolean,
        default: true
    },
    size: String,
    stripe: {
        type: Boolean,
        default: true
    },
    showHeader: {
        type: Boolean,
        default: true
    },
    showSummary: {
        type: Boolean,
        default: false
    },
    height: [String, Number],
    rowKey: {
        type: [String, Number],
        default: 'code'
    },
    currentRowKey: [String, Number],
    rowClassName: [String, Function],
    emptyText: String,
    tooltipEffect: String,
    tableStyle: {
        type: String,
        default: 'width:100%;margin-top:20px;'
    },
    // Table-column Attributes
    columns: {
        type: Array,
        required: true
    },
    // Pagination  Attributes
    total: {
        type: Number,
        default: 0
    },
    summary: {
        type: Object,
        default: _ => {
            return {};
        }
    },
    page: {
        type: Number,
        default: 1
    },
    offset: {
        type: Number,
        default: 20
    },
    layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
        type: Boolean,
        default: true
    },
    hiddenPagination: {
        type: Boolean,
        default: false
    },
    hiddenSummary: {
        type: Boolean,
        default: true
    }
};
export default props;