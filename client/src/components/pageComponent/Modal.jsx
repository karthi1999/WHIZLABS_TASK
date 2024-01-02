import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import BtnComponent from '../baseComponents/BtnComponent';
import { fields } from '../../utils/employeeFields';

export default function Modal(
  {
    open,
    setOpen,
    formData,
    setFormData,
    submitHandler,
    errors,
    setErrors,
    initialState,
    popupData
  }
) {
  const [dragging, setDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];

      // Check if the file size is within the limit (10 MB)
      if (file && file.size > 10 * 1024 * 1024) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: 'File size exceeds 10 MB limit' }));
        setFormData((prevData) => ({
          ...prevData,
          [name]: null,
          avatarName: '',
        }));
        return;
      }

      const allowedExtensions = ['.png', '.jpg', '.gif'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: 'Please upload valid file, like .png, .jpg, .gif' }));
        setFormData((prevData) => ({
          ...prevData,
          [name]: null,
          avatarName: '',
        }));
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
        avatarName: file ? file.name : '',
      }));
    } else {
      if (name === 'phone' && value.length > 0 && !/^\d+$/.test(value)) {
        return;
      }
      if ((name === 'first_name' || name === 'last_name') && /^\d/.test(value)) {
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const deleteImageHandler = () => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: null,
    }));
  }

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
    }
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all sm:w-full sm:max-w-2xl sm:p-6 sm:pt-3">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <div className='flex justify-between items-center border-b pb-4'>
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {popupData.head}
                      </Dialog.Title>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => { setOpen(false); setFormData(initialState) }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>

                    <div className="mt-4">
                      <div className="grid grid-cols-2 gap-x-5">
                        {fields &&
                          fields.map((field, index) => {
                            const { id, label } = field;
                            return (
                              id !== 'avatar' && (
                                <div key={index} className={`${id === 'avatar' ? 'col-span-2' : 'col-span-1'}`}>
                                  <label
                                    htmlFor={id}
                                    className="block text-sm font-medium leading-6 text-gray-900 text-left"
                                  >
                                    {label} {id === 'first_name' && <span className='text-xs text-red-500'>*</span>}
                                  </label>
                                  <div className={`${errors[id] ? "mb-0" : "mb-5"}`}>
                                    <input
                                      id={id}
                                      name={id}
                                      type="text"
                                      value={formData[id]}
                                      onChange={handleChange}
                                      onFocus={handleFocus}
                                      className={`block w-full rounded-md border focus:outline-none focus:border-indigo-600 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 px-3  sm:text-sm sm:leading-6 ${errors[id] ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors[id] && (
                                      <p className="text-xs text-red-500 text-right pt-1 pl-1">{errors[id]}</p>
                                    )}
                                  </div>
                                </div>
                              )
                            );
                          })}

                        <div className="col-span-2">
                          <label htmlFor="avatar" className="block text-sm font-medium leading-6 text-gray-900 text-left">
                            Avatar
                          </label>
                          <div className="mt-2">
                            {formData.avatar && !formData.avatar?.name ?
                              <div className='flex justify-around items-center'>
                                <div>
                                  <img src={formData.avatar} alt="" className="w-auto h-20" />
                                </div>
                                <div>
                                  <button
                                    id="Delete avatar"
                                    type="submit"
                                    onClick={deleteImageHandler}
                                    className="flex w-full justify-center items-center gap-2 rounded-md border border-indigo-800 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 text-indigo-800"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    <spn>Delete avatar</spn>
                                  </button>
                                </div>
                              </div>

                              :
                              <label
                                htmlFor="avatar"
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-8 ${dragging ? 'bg-gray-200' : ''}`}
                              >
                                <div className="text-center">
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <div
                                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none hover:text-indigo-500"
                                    >
                                      <span>Upload a profile image</span>
                                      <input
                                        id="avatar"
                                        name="avatar"
                                        type="file"
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        className="sr-only"
                                        accept=".png, .jpg, .gif"
                                      />
                                    </div>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  {formData.avatar ? (
                                    <div className="flex items-center mt-2 text-xs justify-center">
                                      <p className='bg-green-200 text-green-600 px-2 py-1 rounded'>
                                        <span className="mr-2">File:</span>
                                        {formData.avatar.name}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-xs leading-5 text-gray-600 mt-2">PNG, JPG, GIF up to 10MB</p>
                                  )}
                                  {errors.avatar && (
                                    <p className="text-xs text-red-500 text-right pt-1 pl-1">{errors.avatar}</p>
                                  )}
                                </div>
                              </label>}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <BtnComponent name={popupData.btnTxt} fn={submitHandler} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
