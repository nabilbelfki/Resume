"use client";
import React, { useState } from "react";
import styles from "./Table.module.css";

interface Action {
    label: string;
    action: () => void
}

interface TableProps {
    button?: string;
    placeholder: string;
    actions: Action[];
    headers: string[];
    rows: string[][];
    showing?: number;
}

const Table: React.FC<TableProps> = ({ placeholder, button = null, actions, headers, rows, showing = 25}) => {
    const currentPage = 1;
    const [dropdown, setDropdown] = useState(false);
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.actions}>
                    <button className={styles['dropdown-button']} onClick={() => setDropdown(!dropdown)}>
                        <span>Actions</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 0 6 3" fill="none">
                            <path d="M1 0.5L3 2.5L5 0.5" stroke="#4C4C4C" strokeWidth="0.5"/>
                        </svg>
                    </button>
                    {dropdown && (<div className={styles.dropdown}>
                        {actions.map((action,index) => (
                            <button key={'action-'+index}>{action.label}</button>
                        ))}
                    </div>)}
                </div>
                <div className={styles['create-and-search']}>
                    {button && (
                        <button className={styles.create} onClick={()=> location.href = location.href + '/create'}>{button}</button>
                    )}
                    <div className={styles.search}>
                        <input type="text"placeholder={placeholder}/>
                        <div className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="13" viewBox="0 0 7 7" fill="none">
                                <path d="M5.20646 6.30819L4.18322 5.28978C3.80448 5.59246 3.34432 5.78062 2.84196 5.80814C1.44309 5.88478 0.239371 4.6863 0.15422 3.1321C0.0690905 1.57831 1.13465 0.255095 2.53352 0.178454C3.93202 0.101833 5.13612 1.3007 5.22125 2.85449C5.2519 3.41384 5.13315 3.94306 4.90451 4.39481L5.92775 5.41321C6.15237 5.63685 6.17332 6.01927 5.97448 6.26611C5.77527 6.51297 5.43144 6.53181 5.20646 6.30819ZM4.49739 2.89415C4.43661 1.7847 3.57615 0.927985 2.57758 0.982695C1.57865 1.03742 0.817297 1.98299 0.878082 3.09244C0.938888 4.2023 1.79896 5.05863 2.79789 5.0039C3.79646 4.94919 4.5582 4.004 4.49739 2.89415Z" fill="#BDBDBD"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>
                            <input className={styles.checkbox} type="checkbox" name="select-all"/>
                        </th>
                        {headers.map((header, index) => (
                            <th key={'header-' + index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={'row-'+ rowIndex}>
                            <td>
                                <input className={styles.checkbox} type="checkbox" name="select-row"/>
                            </td>
                            {row.map((cell, columnIndex) =>(
                                <td key={'cell-'+rowIndex+'-'+columnIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.footer}>
                <div className={styles.pagination}>
                    <div className={styles.previous}>
                        <svg style={{rotate: '180deg'}} xmlns="http://www.w3.org/2000/svg" version="1.0"height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#727272" stroke="none">
                            <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z"/>
                            </g>
                        </svg>
                    </div>
                    <div className={styles.label}>Page</div>
                    <input className={styles.page} value={currentPage}/>
                    <div className={styles.label}>of 31 pages</div>
                    <div className={styles.next}>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.0"height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#727272" stroke="none">
                            <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z"/>
                            </g>
                        </svg>
                    </div>
                </div>
                <div className={styles.showing}>
                    <div className={styles.label}>Showing 13 from</div>
                    <input className={styles.limit} value={showing}/>
                    <div className={styles.label}>out of 13 total results</div>
                </div>
            </div>
        </div>
    );
};

export default Table;