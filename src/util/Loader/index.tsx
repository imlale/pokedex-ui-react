import './index.css'

function Loader( {children}: any) {
    return <div className="loader-container">
        {children}
        <span className="loader"></span>
    </div>
}

export default Loader