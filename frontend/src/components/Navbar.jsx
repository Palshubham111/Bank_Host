import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('User Data:', userData); // Debug log
  console.log('User Fullname:', userData?.fullname); // Debug log for fullname specifically

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className='fixed top-0 left-0 right-0 z-50'>

   

      <div className="navbar bg-base-100 shadow-md">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><a>Item 1</a></li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </li>
              <li><a>Item 3</a></li>
            </ul>
          </div>
          <div className='w-20'>
            <a href="https://onlinesbi.sbi/">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/State_Bank_of_India.svg/1200px-State_Bank_of_India.svg.png" 
                alt="SBI BANK"  
                className='cursor-pointer'
              />
            </a>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-bold">
            <li><Link to='/'>Home</Link></li>

            <li className="relative group">
              <a className="cursor-pointer">Banking</a>
              <ul className="p-2 absolute hidden group-hover:block bg-base-100 z-50 mt-7">
                <li><a>Balance check</a></li>
                <li><a>Transaction history</a></li>
              </ul>
            </li>

            <li className="relative group">
              <a className="cursor-pointer">Account Opening</a>
              <ul className="p-2 absolute hidden group-hover:block bg-base-100 z-50 mt-7">
                <li><a href='/saving'>Saving Account</a></li>
                <li><a>Current Account</a></li>
                <li><a>Salary Account</a></li>
                <li><a>Student Account</a></li>
                <li><a>Joint Account</a></li>
                <li><a>Senior citizen Saving Account</a></li>
                <li><a>RD Account</a></li>
                <li><a>FD Account</a></li>
                <li><a>NRI Account</a></li>

              </ul>
            </li>

            <li className="relative group">
              <a className="cursor-pointer">Internet Banking</a>
              <ul className="p-2 absolute hidden group-hover:block bg-base-100 z-50 mt-7">
                <li><a>RTGS</a></li>
                <li><a>NEFT</a></li>
                <li><a>NFPS</a></li>
                <li><a href="/deposit">Deposit Money</a></li>
                <li><Link to="/transfer">Fund Transfer</Link></li>
              </ul>
            </li>

            <li className="relative group">
              <a className="cursor-pointer">Customer Info</a>
              <ul className="p-2 absolute hidden group-hover:block bg-base-100 z-50 mt-7">
                <li><a>Transaction History</a></li>
                <li><Link to="/accsearch">Account Details</Link></li>
                <li><a>KYC</a></li>
              </ul>
            </li>

            <li className="relative group">
              <a className="cursor-pointer">Loan</a>
              <ul className="p-2 absolute hidden group-hover:block bg-base-100 z-50 w-38 mt-7">
                <li><a>Home Loan</a></li>
                <li><a>Car Loan</a></li>
                <li><a>Personal Loan</a></li>
                <li><a>Education Loan</a></li>
                <li><a>Land Loan</a></li>
                <li><a>Business Loan</a></li>
              </ul>
            </li>

            <li><Link to='/about'>About</Link></li>

            {isAuthenticated && (
              <div className='users'>
                <li className='relative group users'>
                  <a href="" className='ml-10 bg-sky-600 text-white  rounded-full font-bold text-xl'>
                    {userData?.fullname ? userData.fullname.charAt(0).toUpperCase() : ''}
                  </a>
                  <ul className=' p-2 absolute hidden group-hover:block bg-base-100 z-50 w-38 mt-10'>
                    <li><a>Change password</a></li>
                    <li><a href='/editname'>Edit name</a></li>
                    <li><a href='/UpdateMob'>Update mobile no.</a></li>
                    <li><a href="/Accdetail">Account details</a></li>
                    <li><a href='/transhistory'>Transaction History</a></li>
                    <li><a onClick={handleLogout}>Logout</a></li>
                  </ul>
                </li>
              </div>
            )}
          </ul>

          
        </div>

        <div className='flex m-6'>
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="btn text-white font-extrabold border-red-600 bg-red-600 transition duration-500"
            >
              Logout
            </button>
          ) : (
            <>
              <div className="navbar-end">
                <Link to="/login" className="btn text-white font-extrabold border-sky-600 bg-sky-600 transition duration-500">
                  Login
                </Link>
              </div>

              <div className="navbar-end ml-2">
                <Link to="/signup" className="btn text-blue-900 font-extrabold border-sky-600 transition duration-500">
                  Signup
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
