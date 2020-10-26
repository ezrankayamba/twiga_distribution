import React, { useEffect, useState } from 'react';
import { ColorsHelper } from '../../../_helpers/ColorsHelper';
import CRUD from '../../../_services/CRUD';
import BarGraph from '../../graph/BarGraph';

function ShareByRegionGraph({ token }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const placeHolder = [{ name: 'Twiga', count: 0 }, { name: 'Others', count: 0 }]
    useEffect(() => {
        CRUD.list("/tracking/reports/share-by-region", token, {
            onSuccess: (res) => {
                setData(res.data)
                console.log(res.data)
                setLoading(false)
            }
        })

    }, [])
    if (loading) return null
    let labels = data.map((d) => {
        return d.reg;
    })
        .filter((v, i, a) => a.indexOf(v) === i);
    let res = placeHolder.map((s) => {
        return {
            label: s.name,
            backgroundColor: ColorsHelper.randomColor(),
            data: labels.map((p) => {
                let x = data.find(
                    (d) => d.reg === p && d.sup === s.name
                );
                return x ? x.count : 0;
            }),
        };
    });
    console.log(res)
    const meta = {
        data: res,
        labels: labels,
        beginAtZero: true,
    };
    return (
        <BarGraph
            stacked={true}
            meta={meta}
            title="Share by Region"
            graphId="customer-share-by-region"
        />
    );
}

export default ShareByRegionGraph;