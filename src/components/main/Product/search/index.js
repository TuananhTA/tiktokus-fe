import React, { useState } from 'react';
import style  from "./style.module.css"

const SearchInput = ({ ref, onCancel, value, setValue }) => {

    const handleCancel = ()=>{
        setValue('');
        onCancel();
    }

    const handleInputChange = (event) => {
        const value = event.target.value;
        setValue(value);
    };
    return (
           <div className={style.searchContainer}>
             <input
                ref={ref}
                type="text"
                placeholder="Tìm kiếm..."
                value={value}
                onChange={handleInputChange}
            />
            <button onClick={handleCancel} type="button">Hủy</button>
           </div>
    );
};

export default SearchInput;
