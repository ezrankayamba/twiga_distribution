import React, {Component} from 'react';
import Modal from "../../modal/Modal";
import CrudTable from "../../utils/CrudTable";

class BatchDetailPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: 1,
            count: 0,
            pageNo: 1,
            batch: props.batch
        }
        this.onPageChange = this.onPageChange.bind(this)
    }

    onPageChange(pageNo) {
        this.setState({pageNo})
    }

    render() {
        const {batch} = this.props
        const {pageNo} = this.state
        const records = batch ? batch.records : []
        let count = batch ? batch.records.length : 0
        const pageSize = 10
        let pages = Math.ceil(count / pageSize)
        let from = (pageNo - 1) * pageSize
        let to = from + pageSize
        const pagination = {pages, pageNo, onPageChange: this.onPageChange}
        let pageRecords = records.slice(from, to)

        let data = {
            records: pageRecords,
            headers: [
                {field: 'account', title: 'MSISDN'},
                {field: 'amount', title: 'Amount'},
                {field: 'reason', title: 'Reason'},
            ],
            title: null,
            exportable: false
        }
        const {open} = this.props
        return batch && (
            <Modal large={true} modalId="batchDetail" title={batch.name} show={open} handleClose={() => {
                this.props.complete(false)
            }} content={<CrudTable pagination={pagination} tableId="batchDetailTable" columns={data.headers}
                                   data={data.records}/>}/>
        );
    }
}

export default BatchDetailPopup;
