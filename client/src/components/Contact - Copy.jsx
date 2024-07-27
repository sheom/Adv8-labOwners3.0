import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Datepicker } from 'flowbite-react';
import { Button } from 'flowbite-react';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  ////////////////////////////////////////////////////////////
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    city: '',
    address: '',
    pin_code: '',
    contact_no: '',
    contact_email: '',
    booking_date: ''
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'lab' || e.target.id === 'doc') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'nabh' ||
      e.target.id === 'nabl' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  ////////////////////////////////////////////////////////////
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   if (formData.imageUrls.length < 1)
    //     return setError('You must upload at least one image');
    //   if (+formData.regularPrice < +formData.discountPrice)
    //     return setError('Discount price must be lower than regular price');
    //   setLoading(true);
    //   setError(false);
    //   const res = await fetch('/api/listing/create', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       ...formData,
    //       userRef: currentUser._id,
    //     }),
    //   });
    //   const data = await res.json();
    //   setLoading(false);
    //   if (data.success === false) {
    //     setError(data.message);
    //   }
    //   navigate(`/listing/${data._id}`);
    // } catch (error) {
    //   setError(error.message);
    //   setLoading(false);
    // }
  };
  //
  return (
    <>
      {landlord && (
        <>
        <div>
          <hr />
          <br/>
        <p>
          Make booking for{' '}
          <span className='font-semibold'>{listing.name}</span>
        </p>
        <br/>
          <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                  <input
                    type='text'
                    placeholder='Name'
                    className='border p-3 rounded-lg'
                    id='name'
                    maxLength='62'
                    minLength='5'
                    required
                    onChange={handleChange}
                    value={formData.name}
                  />

                  <input
                    type='text'
                    placeholder='Address'
                    className='border p-3 rounded-lg'
                    id='address'
                    required
                    onChange={handleChange}
                    value={formData.address}
                  />
                  <input
                    type='text'
                    placeholder='Pincode'
                    className='border p-3 rounded-lg'
                    id='pin_code'
                    required
                    onChange={handleChange}
                    value={formData.pin_code}
                  />
                  <input
                    type='text'
                    placeholder='Contact no'
                    className='border p-3 rounded-lg'
                    id='contact_no'
                    required
                    onChange={handleChange}
                    value={formData.contact_no}
                  />
                  <input
                    type='text'
                    placeholder='contact E-mail'
                    className='border p-3 rounded-lg'
                    id='contact_email'
                    onChange={handleChange}
                    value={formData.contact_email}
                  />
                  <hr />
                  <Datepicker />
                  <input
                    type='date'
                    placeholder='Booking Date'
                    className='border p-3 rounded-lg'
                    min={Date.now()}
                    id='booking_date'
                    onChange={handleChange}
                    value={formData.booking_date}
                  />
                </div>


                <div className='flex flex-col flex-1 gap-4'>
                  <p className='font-semibold'>
                    Images(max 6):
                    <span className='font-normal text-gray-600 ml-2'>
                      The first image will be the cover
                    </span>
                  </p>
                  <div className='flex gap-4'>
                    <input
                      onChange={(e) => setFiles(e.target.files)}
                      className='p-3 border border-gray-300 rounded w-full'
                      type='file'
                      id='images'
                      accept='image/*'
                      multiple
                    />
                    <button
                      type='button'
                      disabled={uploading}
                      onClick={handleImageSubmit}
                      className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  <p className='text-red-700 text-sm'>
                    {imageUploadError && imageUploadError}
                  </p>
                  {formData.imageUrls.length > 0 &&
                    formData.imageUrls.map((url, index) => (
                      <div
                        key={url}
                        className='flex justify-between p-3 border items-center'
                      >
                        <img
                          src={url}
                          alt='listing image'
                          className='w-20 h-20 object-contain rounded-lg'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveImage(index)}
                          className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  <button
                    disabled={loading || uploading}
                    className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                  >
                    {loading ? 'Registering...' : 'Register Center'}
                  </button>
                  {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
          </form>
        </div>
        <div className='border-solid border-2 border-indigo-60'>
          <div className="flex flex-row ">
            <div className="basis-1/2 border-solid border-2 border-indigo-600">
              
            </div>
            
            <div className="basis-1/2 border-solid border-2 border-indigo-600">

            </div>
          </div>
        </div>
        
        
        <div className='flex flex-col md:flex-row border-solid border-2 border-indigo-60'>
          <div className='flex flex-col gap-2'>
              <textarea
                name='message'
                id='message'
                rows='2'
                value={message}
                onChange={onChange}
                placeholder='Enter your message here...'
                className='w-full border p-3 rounded-lg'
              ></textarea>

              <Link
              // to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
              className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
              >
                Confirm Booking        
              </Link>
          </div>
        </div>
        </>
      )}
    </>
  );
}
