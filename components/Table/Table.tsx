"use client";
import React, { useState, useEffect } from "react";
import styles from "./Table.module.css";
import { Action } from "@/lib/types";
import { stringToHexColor, isColorTooDark } from "@/lib/color";
import Image from "next/image";

interface Column {
    label: string;
    selectors: string[][];
    type?: string;
    avatar?: string;
    colors?: Color[];
    sort?: boolean;
    sortKey?: string;
    visibility?: string[];
    active?: string[];
    sortable?: boolean;
    alignment?: 'left' | 'center' | 'right';
    flex?: number;
    maxWidth?: string;
    formatter?: (text: string) => string;
    thumbnailBackgroundColor?: string[][];
}

interface Color {
    key: string;
    color: string;
}

interface TableProps {
    actions: Action[];
    columns: Column[];
    entity: string;
    endpoint?: string;
    showing?: number;
    create?: boolean;
    link?: boolean;
    style?: React.CSSProperties;
}

type Row = {
    id: string;
} & Record<string, unknown>;

const Table: React.FC<TableProps> = ({ actions, columns, entity, showing: initialShowing = 25, create = true, endpoint = '', link = true, style = {} }) => { // Renamed prop to avoid naming conflict
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [data, setData] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [dropdown, setDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // --- FIX 1: Make 'showing' a state variable and add an inputValue state for the input field ---
    const [showing, setShowing] = useState(initialShowing);
    const [showingInput, setShowingInput] = useState(String(initialShowing));

    // Update the initial sort logic to use the 'sort' property for initial sorting
    const initialSortColumn = columns.find(column => column.sort);
    const [sortBy, setSortBy] = useState(
        initialSortColumn?.selectors[0].join('.') || 'created'
    );
    const [order, setOrder] = useState<'desc' | 'asc'>('desc');

    const alignment = {
        "left": "flex-start",
        "center": "center",
        "right": "flex-end",
    };

    // Add this useEffect hook to your component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdownElement = document.querySelector(`.${styles.dropdown}`);
            const buttonElement = document.querySelector(`.${styles['dropdown-button']}`);
            
            if (dropdown && dropdownElement && buttonElement) {
                const isClickInsideDropdown = dropdownElement.contains(event.target as Node);
                const isClickOnButton = buttonElement.contains(event.target as Node);
                
                if (!isClickInsideDropdown && !isClickOnButton) {
                    setDropdown(false);
                }
            }
        };

        // Add event listener when dropdown is open
        if (dropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup function
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdown]); // Only re-run if dropdown state changes

    // Update your useEffect dependency array to include sortBy and order
    useEffect(() => {
        const fetchData = async () => {
            const folder = endpoint ? endpoint : ((entity.toLowerCase() === 'media' || entity.toLowerCase() === 'message') ? entity.toLowerCase() : entity.toLowerCase() + 's');
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/${folder}?page=${currentPage}&limit=${showing}&search=${searchQuery}&sortBy=${sortBy}&sortOrder=${order}`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${folder}`);
                }

                const data = await response.json();
                console.log("Data", data.data);
                setData(data.data);
                setTotalResults(data.total);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
                console.error(`Error fetching ${folder}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [entity, endpoint, currentPage, showing, searchQuery, sortBy, order]); // Add sortBy and order to dependencies

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const getText = (row: Row, column: Column) => {
        const values = column.selectors
            .map(selectorPath => {
                // let currentValue: any = row;
                // for (const key of selectorPath) {
                //     if (currentValue && typeof currentValue === 'object' && key in currentValue) {
                //         currentValue = currentValue[key];
                //     } else {
                //         currentValue = undefined; // Path not found
                //         break;
                //     }
                // }
                // return currentValue !== undefined ? String(currentValue) : '';
                return selector(row, selectorPath);
            })
            .filter(value => value);

        return values;
    };

    const selector = (row: Row, selectors: string[]) => {
        let currentValue: unknown = row;
        for (const selector of selectors) {
            if (currentValue && typeof currentValue === 'object' && selector in (currentValue as Record<string, unknown>)) {
                currentValue = (currentValue as Record<string, unknown>)[selector];
            } else {
                currentValue = undefined;
                break;
            }
        }
        return currentValue !== undefined && currentValue !== null ? String(currentValue) : '';
    }

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid date
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        // Add ordinal suffix to day
        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) suffix = 'st';
        else if (day % 10 === 2 && day !== 12) suffix = 'nd';
        else if (day % 10 === 3 && day !== 13) suffix = 'rd';
        
        return `${month} ${day}${suffix}, ${year}`;
    };

    const getStatusColor = (status: string, colors: Color[] = []): string => {
        const foundColor = colors.find(color => color.key === status);
        return foundColor ? foundColor.color : '#000000'; // Default to black if no color found
    };

    const renderCellContent = (row: Row, column: Column) => {
        const values = getText(row, column);
        if (column.type === 'thumbnail') {
            const backgroundColor = column.thumbnailBackgroundColor ? getText(row, { selectors: column.thumbnailBackgroundColor } as Column).join("") : '#8C8C8C';
            return (
                <div className={styles.thumbnail} style={{ backgroundColor }}>
                    <Image 
                        src={values.join("")} 
                        alt={`${values[0]} ${values[1]}`} 
                        width={35}
                        height={35}
                    />
                </div>
            );
        }

        let content = values.join(" ");
        if (column.formatter) {
            content = column.formatter(content);
        }
        
        // Apply formatting based on column type
        if (column.type === 'date') {
            content = formatDate(content);
        }

        if (column.type === 'active'){
            const active = selector(row, column.active ?? []) === 'Active';
            return (<div className={styles.active}>
                <span>{content}</span>
                <span className={active ? styles['green-circle'] : styles['yellow-circle'] }></span>
            </div>);
        }

        if (column.type === 'visibility'){
            const active = selector(row, column.visibility ?? []) === 'Public';
            return (<div className={styles.active}>
                <span>{content}</span>
                <span className={active ? styles['green-circle'] : styles['yellow-circle'] }></span>
            </div>);
        }

        if (column.type === 'status' && column.colors) {
            const color = getStatusColor(content, column.colors);
            return <span title={content} className={styles.status} style={{ color }}>{content}</span>;
        }

        if (column.type === 'avatar') {
            const rawAvatarUrl = column.avatar ? row[column.avatar] : null;
            const avatarUrl = typeof rawAvatarUrl === 'string' ? rawAvatarUrl : null;
            const backgroundColor = stringToHexColor(content);
            const color = isColorTooDark(backgroundColor) ? '#FFFFFF' : '#4C4C4C';

            // Split the content into words to handle single-word names
            const values = content ? content.split(' ') : [];
            
            // Safely access values[0] and values[1] and their first characters
            const firstInitial = values[0] ? values[0][0] : '';
            const secondInitial = values[1] ? values[1][0] : '';
            
            const initials = firstInitial + secondInitial;

            return (
                <>
                    <div className={styles.avatar} style={{ backgroundColor }}>
                        {avatarUrl ? (
                            <Image 
                                src={avatarUrl} 
                                alt={content} 
                                width={30}
                                height={30}
                                style={{ borderRadius: "50%"}}
                            />
                        ) : (
                            <span style={{ color }}>{initials}</span>
                        )}
                    </div>
                    <span title={content}>{content}</span>
                </>
            );
        }

        return content;
    };

    const handleRowSelect = (rowId: string) => {
        setSelectedRows(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(rowId)) {
                newSelection.delete(rowId);
            } else {
                newSelection.add(rowId);
            }
            return newSelection;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked);
        
        if (isChecked) {
            const allIds = data.map(row => {
                const rowId = (row as { _id?: string })._id ?? row.id;
                return String(rowId);
            });
            setSelectedRows(new Set(allIds));
        } else {
            setSelectedRows(new Set());
        }
    };

    const selected = () => {
        return Array.from(selectedRows);
    };

    // Update the handleSort function to check sortable property (default true)
    const handleSort = (column: Column) => {
        // Skip if column is explicitly not sortable
        if (column.sortable === false) return;
        
        const columnSortKey = column.sortKey ? column.sortKey : column.selectors[0].join('.');
        
        // If clicking on the same column, toggle the order
        if (sortBy === columnSortKey) {
            setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // If clicking on a different column, set it as the new sort and default to desc
            setSortBy(columnSortKey);
            setOrder('desc');
        }
    };

    // --- FIX 2: Create a separate state for the page input value ---
    const [pageInputValue, setPageInputValue] = useState(String(currentPage));

    useEffect(() => {
        setPageInputValue(String(currentPage));
    }, [currentPage]);

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPageInputValue(value);
        
        // Only update currentPage state on a valid, positive integer
        const page = parseInt(value);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        } else if (value === '') {
            // This allows the user to clear the input
            setCurrentPage(1); // or set a temporary value that doesn't trigger a fetch
        }
    };

    const handleShowingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setShowingInput(value);

        const limit = parseInt(value);
        if (!isNaN(limit) && limit >= 1) {
            setShowing(limit);
            setCurrentPage(1);  // Reset to first page whenever showing changes
        }
    };
    
    // --- FIX 4: Add a handler to prevent page changes on input blur if the value is invalid ---
    const handlePageInputBlur = () => {
        const page = parseInt(pageInputValue);
        if (isNaN(page) || page < 1 || page > totalPages) {
            // Reset to the current valid page if the input is invalid
            setPageInputValue(String(currentPage));
        } else {
            setCurrentPage(page);
        }
    };

    return (
        <div className={styles.container} style={style}>
            <div className={styles.header}>
                <div className={styles.actions}>
                    <button className={styles['dropdown-button']} onClick={() => setDropdown(!dropdown)}>
                        <span>Actions</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 0 6 3" fill="none">
                            <path d="M1 0.5L3 2.5L5 0.5" stroke="var(--table-action-icon)" strokeWidth="0.5"/>
                        </svg>
                    </button>
                    {dropdown && (
                        <div className={styles.dropdown}>
                            {actions.map((action, index) => (
                                <button 
                                    key={'action-' + index} 
                                    onClick={() => {
                                        const selectedIDs = selected();
                                        if (!selectedIDs.length) {
                                            alert(`No ${entity} selected`);
                                            return;
                                        }
                                        action.action(selectedIDs);
                                    }}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles['create-and-search']}>
                    {create && (
                        <button 
                            className={styles.create} 
                            onClick={() => window.location.href = window.location.pathname + '/create'}
                        >
                            {`Create ${entity}`}
                        </button>
                    )}
                    <div className={styles.search}>
                        <input 
                            type="text"
                            placeholder={`Search ${entity === "Media" ? entity : entity + 's'}`}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <div className={styles.icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="13" viewBox="0 0 7 7" fill="none">
                                <path d="M5.20646 6.30819L4.18322 5.28978C3.80448 5.59246 3.34432 5.78062 2.84196 5.80814C1.44309 5.88478 0.239371 4.6863 0.15422 3.1321C0.0690905 1.57831 1.13465 0.255095 2.53352 0.178454C3.93202 0.101833 5.13612 1.3007 5.22125 2.85449C5.2519 3.41384 5.13315 3.94306 4.90451 4.39481L5.92775 5.41321C6.15237 5.63685 6.17332 6.01927 5.97448 6.26611C5.77527 6.51297 5.43144 6.53181 5.20646 6.30819ZM4.49739 2.89415C4.43661 1.7847 3.57615 0.927985 2.57758 0.982695C1.57865 1.03742 0.817297 1.98299 0.878082 3.09244C0.938888 4.2023 1.79896 5.05863 2.79789 5.0039C3.79646 4.94919 4.5582 4.004 4.49739 2.89415Z" fill="var(--table-input-placeholder)"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{flex: 1}}>
                                <input 
                                    className={styles.checkbox} 
                                    type="checkbox" 
                                    name="select-all"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            {columns.map((column, index) => (
                                <th 
                                    key={'header-' + index} 
                                    style={{
                                        flex: column.flex ? column.flex : 1,
                                        justifyContent: column.alignment ? alignment[column.alignment] : "flex-start",
                                        maxWidth: column.maxWidth ? column.maxWidth : "unset",
                                        cursor: column.sortable !== false ? 'pointer' : 'default'
                                    }}
                                    onClick={() => handleSort(column)}
                                >
                                    <span>{column.label}</span>
                                    {column.sortable !== false && (
                                        <div className={styles.sorting}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="7" viewBox="0 0 3 2" fill="none">
                                                <path d="M1.65119 0.674574C1.57143 0.582482 1.42857 0.582482 1.34881 0.674574L0.487556 1.66907C0.375381 1.7986 0.467392 2 0.638742 2L2.36126 2C2.53261 2 2.62462 1.7986 2.51244 1.66907L1.65119 0.674574Z" fill={sortBy === column.selectors[0].join('.') && order === 'asc' ? '#727272' : 'none'}/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="7" viewBox="0 0 3 2" fill="none">
                                                <path d="M1.65119 1.82543C1.57143 1.91752 1.42857 1.91752 1.34881 1.82543L0.487556 0.830931C0.375381 0.701402 0.467392 0.5 0.638742 0.5L2.36126 0.5C2.53261 0.5 2.62462 0.701402 2.51244 0.830931L1.65119 1.82543Z" fill={sortBy === column.selectors[0].join('.') && order === 'desc' ? '#727272' : 'none'}/>
                                            </svg>
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => {
                            const rowId = String((row as { _id?: string })._id ?? row.id);
                            return (
                            <tr key={'row-' + index}>
                                <td style={{flex: 1}}>
                                    <input 
                                        className={styles.checkbox} 
                                        type="checkbox" 
                                        name="select-row"
                                        checked={selectedRows.has(rowId)}
                                        onChange={() => handleRowSelect(rowId)}
                                    />
                                </td>
                                {columns.map((column, colIndex) => (
                                    <td onClick={() => {if (!link) return; location.href = window.location.href + (entity === 'Message' ? '/view/' : '/edit/') + rowId}}
                                        key={`${index}-${column.label}-${colIndex}`}
                                        title={getText(row, column).join(" ")}
                                        style={{
                                            flex: column.flex ? column.flex : 1, 
                                            justifyContent: column.alignment ? alignment[column.alignment] : "flex-start",
                                            maxWidth: column.maxWidth ? column.maxWidth : "unset",
                                            cursor: link ? 'pointer': 'default'
                                        }}>
                                        {renderCellContent(row, column)}
                                    </td>
                                ))}
                            </tr>
                        )})}
                    </tbody>
                </table>
            )}

            <div className={styles.footer}>
                <div className={styles.pagination}>
                    <button 
                        className={styles.previous} 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        <svg style={{rotate: '180deg'}} xmlns="http://www.w3.org/2000/svg" version="1.0"height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="var(--table-icon)" stroke="none">
                            <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z"/>
                            </g>
                        </svg>
                    </button>
                    <div className={styles.label}>Page</div>
                    <input 
                        className={styles.page} 
                        value={pageInputValue} // Bind the input's value to the temporary state
                        onChange={handlePageInputChange} // Handle input changes
                        onBlur={handlePageInputBlur} // Handle when the user clicks away
                        type="text" // Use text to allow for empty string
                    />
                    <div className={styles.label}>of {totalPages} pages</div>
                    <button 
                        className={styles.next} 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.0"height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="var(--table-icon)" stroke="none">
                            <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z"/>
                            </g>
                        </svg>
                    </button>
                </div>
                <div className={styles.showing}>
                    <div className={styles.label}>Showing</div>
                    <input 
                        className={styles.limit} 
                        value={showingInput} // Use the new state for the input field
                        onChange={handleShowingInputChange} // Handle changes
                    />
                    <div className={styles.label}>out of {totalResults} total results</div>
                </div>
            </div>
        </div>
    );
};

export default Table;
