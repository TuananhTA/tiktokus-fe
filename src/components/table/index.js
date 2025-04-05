import PropTypes from 'prop-types';
import style from "./table.module.css"
import EmptyState from '../EmptyState/EmptyState';
function Table({ columns, data, onClick, page = 0, size = 0}){
    if(data.length === 0) return <EmptyState message='Trống'/>
    return (
        <table className={style["reusable-table"]}>
            <thead>
                <tr>
                   <th>STT</th>
                    {columns.map((column, index) => (
                        <th key={index}>{column.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data?.map((row, rowIndex) => (
                    <tr key={row.id} onClick={()=>onClick(row)}>

                        <td>{page * size + rowIndex + 1}</td>
                        {columns.map((column, colIndex) => (
                            column.type === "IMAGE" ? 
                                (<td
                                    style={{alignItems: "center" }}
                                    >
                                    <img src={row[column.name]} alt="Item" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                                </td>)
                                :
                                (<td key={colIndex}>{row[column.name]}</td>)
                            
                        ))}
                    </tr>
                ))} 
            </tbody>
        </table>
    );
}
Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;