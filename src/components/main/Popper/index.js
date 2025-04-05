import style from "./style.module.css"
export default function Popper({children}){

    return (
        <div className={style.wapper}>
            {children}
        </div>
    )

}