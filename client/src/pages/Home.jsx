import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [labListing, setLabListing] = useState([]);
  const [docListing, setDocListing] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchLabListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchLabListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=lab&limit=4');
        const data = await res.json();
        setLabListing(data);
        fetchDocListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDocListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=doc&limit=4');
        const data = await res.json();
        setDocListing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div>
        
      </div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto bg-slate-50 border-solid border-2 border-indigo-60 mt-10 mb-10'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your <span className='text-slate-500'>perfect</span>
          <br />
          lab test with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Adva8 is the best place to find your perfect labs for accurate diagonostics.
          <br />
          We have a wide range of labs of your choices.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Lets get started...
        </Link>
      </div>

      {/* swiper */}
      {/* <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id} >
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper> */}

      {/* listing results for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {docListing && docListing.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent listed Doctor clinics</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=doc'}>Show more Doctor clinics</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {docListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {labListing && labListing.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent listed labs</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more labs</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {labListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
