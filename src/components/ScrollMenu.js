import React, { useRef, useState } from "react";
import styles from "./ScrollMenu.module.css";

const ScrollMenu = ({ items, onItemClick, selected = 0 }) => {
  const scrollRef = useRef();
  const [selectedItem, setSelectedItem] = useState(selected);

  const scroll = (direction) => {
    const scrollAmount = 300; // Khoảng cách mỗi lần cuộn
    if (direction === "left") {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else if (direction === "right") {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item.id); // Đặt item đang được chọn
    onItemClick(item); // Gọi callback từ props
  };
  const all = {
    id : 0,
    categoryName : ""
  }

  return (
    <div className={styles.scrollMenu}>
      <button
        className={`${styles.arrow} ${styles.leftArrow}`}
        onClick={() => scroll("left")}
      >
        ←
      </button>
      <div className={styles.scrollContent} ref={scrollRef}>
        <div
          className={`${styles.item} ${
            selectedItem === all.id ? styles.selected : ""
          }`}
          onClick={() => handleItemClick(all)}
        >
          Tất cả
        </div>
        {items?.map((item) => (
          <div
            key={item.id}
            className={`${styles.item} ${
              selectedItem === item.id ? styles.selected : ""
            }`}
            onClick={() => handleItemClick(item)}
          >
            {item.categoryName}
          </div>
        ))}
      </div>
      <button
        className={`${styles.arrow} ${styles.rightArrow}`}
        onClick={() => scroll("right")}
      >
        →
      </button>
    </div>
  );
};

export default ScrollMenu;
