import { NavLink } from 'react-router-dom'
import './BreadCrumb.css'

function BreadCrumb({ params }) {
  return (
    <nav style={{ marginTop: "5rem", paddingTop: "2rem" }} className='py-sm-5'>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <p className="text-start breadCrumb"><NavLink to='/' style={{ color: "black" }}>Home </NavLink> <span> /</span><span style={{ marginLeft: "0.8rem" }} className='active'>{Object.keys(params || {}).length === 0 ? 'Products' : params?.category}</span></p>
          </div>
        </div>
      </div>
    </nav>  
  )
}

export default BreadCrumb
