import React, { useEffect, useState } from 'react';
import { fields } from '../utils/employeeFields';
import NavBar from '../components/pageComponent/NavBar';
import Menu from '../components/baseComponents/Menu';
import BtnComponent from '../components/baseComponents/BtnComponent';
import Modal from '../components/pageComponent/Modal';
import { isValidEmail, isValidPhone } from '../utils/checkHandler';
import { useDispatch, useSelector } from 'react-redux';
import getCookie from "../utils/getCookie"
import { createEmployeeAPI, deleteEmployeeAPI, getAccountDetailsAPI, getAllEmployeeAPI, signoutAPI, updateEmployeeAPI } from '../store';
import { useNavigate } from 'react-router-dom';
import getHeader from '../utils/getHeader';
import WarnModal from '../components/pageComponent/WarnModal';
import deleteCookie from '../utils/deleteCookie';
import { AppLoader } from "../components/baseComponents/AppLoader";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accountDetails } = useSelector((state) => state.accountState)
  const { isLoading, employeeData, employeeCount } = useSelector((state) => state.employeeState)
  const [employeeList, setEmployeeList] = useState([])
  const [open, setOpen] = useState(false)
  const [load, setLoad] = useState(true)
  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)
  const pageLimit = 10
  const [deletePopup, setDeletePopup] = useState(false)
  const [deleteEmployee, setDeleteEmployee] = useState(null)
  const [popupData, setPopupData] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [sortOrder, setSortOrder] = useState('');
  const [errors, setErrors] = useState({});
  const menuList = ['Edit', 'Delete'];
  const session = getCookie('wt_s_id');
  let initialState = {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    company: '',
    job_title: '',
    is_profile: true,
    avatar: null,
  };
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (session) {
      dispatch(getAccountDetailsAPI({ session_uuid: session }))
      if (accountDetails !== null && accountDetails.length === 0) {
        return navigate('/')
      }
    }
  }, [])

  useEffect(() => {
    // Pagenation calculation
    setTotalPage(Math.ceil(employeeCount / pageLimit))
  }, [employeeCount])

  useEffect(() => {
    // Get all users call
    if (accountDetails) {
      const { account_uuid } = accountDetails;
      let body = { account_uuid: account_uuid, page: page, limit: pageLimit };
      dispatch(getAllEmployeeAPI(getHeader(accountDetails), body))
    }

    // Cookie check
    if (!session) {
      deleteCookie('wt_s_id')
      navigate('/')
    }

  }, [accountDetails])

  useEffect(() => {
    setEmployeeList(employeeData)
  }, [employeeData])

  useEffect(() => {
    setLoad(isLoading)
  }, [isLoading])

  // Filter for sorting employee list
  const filteredAndSortedEmployeeList = employeeList && employeeList.length > 0
    ? employeeList
      .filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchValue.toLowerCase())
        )
      )
      .sort((a, b) => {
        const firstNameA = (a.first_name || '').toLowerCase();
        const firstNameB = (b.first_name || '').toLowerCase();

        if (sortOrder === 'asc') {
          return firstNameA.localeCompare(firstNameB);
        } else if (sortOrder === 'desc') {
          return firstNameB.localeCompare(firstNameA);
        } else {
          return Number(a.uuid) - Number(b.uuid)
        }
      })
    : [];


  const submitHandler = (e) => {
    const validationErrors = {};

    const validations = [
      {
        field: 'first_name',
        validate: (value) => !value.trim(),
        message: 'First name cannot be empty',
      },
      {
        field: 'email',
        validate: (value) => value && !isValidEmail(value),
        message: 'Invalid email address',
      },
      {
        field: 'phone',
        validate: (value) => value && !isValidPhone(value),
        message: 'Invalid phone number',
      },
    ];

    validations.forEach(({ field, validate, message }) => {
      if (validate(formData[field])) {
        validationErrors[field] = message;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== 'avatar') {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (formData.avatar) {
      formDataToSend.append('avatar', formData.avatar);
    }

    if (accountDetails) {
      if (e.target.id === "Update") {
        dispatch(updateEmployeeAPI(getHeader(accountDetails), formDataToSend));
        setPage(1)
      } else {
        formDataToSend.append('id', employeeCount && employeeList.length > 0 ? Number(employeeList[employeeList.length - 1].id) + 1 : 1)
        dispatch(createEmployeeAPI(getHeader(accountDetails), formDataToSend));
        setPage(1)
      }
    }

    setErrors({});
    setOpen(false);
    setFormData(initialState);
  };

  const menuListHandler = (name, items) => {
    if (name === "Edit") {
      setFormData(items);
      setOpen(true);
      setPopupData({ head: 'Update Employee Details', btnTxt: 'Update' });
    } else if (name === "Delete") {
      setDeletePopup(true);
      setDeleteEmployee(items)
    } else if (name === "Delete All") {
      setDeletePopup(true);
      setDeleteEmployee(items)
    } else {
      deleteCookie('wt_s_id');
      dispatch(signoutAPI());
      navigate('/login');
    }
  }

  const deleteHandle = () => {
    setPage(1)
    if (accountDetails && deleteEmployee) {
      let body = { uuid: deleteEmployee.uuid };
      dispatch(deleteEmployeeAPI(getHeader(accountDetails), body))
    }
  }

  const pageHandler = (e) => {
    let id = e.target.id
    if (accountDetails) {
      const { account_uuid } = accountDetails;
      if (id === "Previous") {
        setPage(prev => prev - 1)
        dispatch(getAllEmployeeAPI(getHeader(accountDetails), { account_uuid: account_uuid, page: page - 1, limit: pageLimit }))
      } else {
        setPage(prev => prev + 1)
        dispatch(getAllEmployeeAPI(getHeader(accountDetails), { account_uuid: account_uuid, page: page + 1, limit: pageLimit }))
      }
    }
  }

  const deleteAllHandler = () => {
    if (accountDetails) {
      setPage(1)
      let body = { account_uuid: accountDetails.account_uuid };
      dispatch(deleteEmployeeAPI(getHeader(accountDetails), body))
    }
  }

  return (
    <>
      <div className='max-w-screen max-h-screen text-sm'>
        {popupData &&
          <Modal
            open={open}
            setOpen={setOpen}
            formData={formData}
            setFormData={setFormData}
            submitHandler={submitHandler}
            errors={errors}
            setErrors={setErrors}
            initialState={initialState}
            popupData={popupData}
          />}
        <WarnModal
          open={deletePopup}
          setOpen={setDeletePopup}
          deleteHandle={deleteHandle}
        />
        <div>
          {accountDetails &&
            <NavBar
              setOpen={setOpen}
              setSearchValue={setSearchValue}
              accountDetails={accountDetails}
              setPopupData={setPopupData}
              menuListHandler={menuListHandler}
            />}
        </div>
        <div className='w-full h-full'>
          <div className='flex w-full'>
            <div className='w-12 bg-orange-500 text-white font-semibold text-base text-center border px-5 flex justify-center items-center'>
              <p>Id</p>
            </div>
            <div className='grid grid-cols-11 w-full'>
              {fields &&
                fields.map((item, index) => {
                  const { id, label } = item;
                  return (
                    <div
                      key={index}
                      className={`p-5 bg-orange-500 text-white font-semibold text-base text-center border px-2 ${id === 'avatar' || id === 'company' || id === 'email' || id === 'job_title' ? 'col-span-2' : ''}`}
                    >
                      {id === 'first_name' && (
                        <div className="flex items-center">
                          {label}
                          <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="ml-1"
                          >
                            {sortOrder === 'asc' ? '▲' : '▼'}
                          </button>
                        </div>
                      )}
                      {id !== 'first_name' && <div>{label}</div>}
                    </div>
                  );
                })}
            </div>
            <div className='px-3 flex justify-center items-center border bg-orange-500'>
              {employeeCount !== 0 &&
                <Menu menuList={['Delete All']} fn={() => deleteAllHandler()}>
                  <span className="sr-only">Open options</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-slate-600 bg-slate-100 rounded-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                  </svg>
                </Menu>
              }
            </div>
          </div>

          <div className='h-[500px] overflow-auto hide-scrollbar'>
            {filteredAndSortedEmployeeList &&
              filteredAndSortedEmployeeList.length > 0 ?
              filteredAndSortedEmployeeList.map((items, index) => {
                return (
                  <div className={`flex ${(index + 1) % 2 === 0 ? 'bg-gray-100' : ''}`} key={index}>
                    <div className="w-12 text-center border px-5 flex justify-center items-center">
                      {items.id}
                    </div>
                    <div className="grid grid-cols-11 w-full">
                      {fields &&
                        fields.map((item, i) => {
                          const { id } = item;
                          return (
                            <div
                              key={index + i}
                              className={`p-2 border px-2 flex items-center ${id === 'avatar' ? 'justify-center' : ''
                                } ${id === 'avatar' || id === 'company' || id === 'email' || id === 'job_title' ? 'col-span-2' : ''}`}
                            >
                              {id !== 'avatar' ? (
                                <p className='truncate' title={items[id]}>{id === 'uuid' ? index + 1 : items[id] || '----'}</p>
                              ) : (items[id] ? (
                                <img src={items[id]} alt="" className="w-auto h-20" />
                              ) : (
                                <img src="https://www.freeiconspng.com/uploads/account-icon-8.png" alt="" className="w-auto h-20" />
                              ))}
                            </div>
                          )
                        })}
                    </div>
                    <div className="px-3 border flex justify-center items-center">
                      <Menu id={index} end={employeeList.length} menuList={menuList} items={items} fn={menuListHandler}>
                        <span className="sr-only">Open options</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-slate-600 bg-slate-100 rounded-full">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                      </Menu>
                    </div>
                  </div>
                )
              })
              :
              <div className='w-full h-full flex flex-col justify-center items-center'>
                <div><img src='/nodata.png' className='w-auto h-80' alt='' /></div>
                <div><p className='font-semibold text-gray-400'>No datas</p></div>
              </div>
            }
          </div>
        </div>
        {load && <AppLoader />}

        <div className='flex justify-end items-center w-1/4 gap-3 p-5 py-3 ml-auto'>
          <div className='w-full'>
            <p>Page {page} to <span className='font-semibold'>{totalPage || 1}</span></p>
          </div>
          <BtnComponent name='Previous' disable={page <= 1} fn={pageHandler} />
          <BtnComponent name='Next' disable={page >= totalPage} fn={pageHandler} />
        </div>
      </div>
    </>
  )
}

export default Home