import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Header from "./header/Header";
import style from "./style.module.css"

export default function Main({children, title}) {
  return (
    <div style={{height: "100vh"}}>
      <Header title={title}></Header>
      <div className={style.main}>
          {children}
      </div>
    </div>
  );
}
