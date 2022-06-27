export const Button = ({ title, onClick, className }) => {
    return <button className={`button ${className || ''}`} onClick={() => onClick && onClick()}>
        { title }
    </button>
}